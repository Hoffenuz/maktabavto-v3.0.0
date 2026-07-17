interface QuestionDataFormat1 {
  id?: number;
  bilet_id?: number;
  question_id?: number;
  name?: string | null;
  question: {
    oz?: string;
    uz?: string;
    ru?: string;
  };
  photo?: string | null;
  image?: string | null;
  answers: {
    status: number;
    answer_id?: number;
    answer: {
      oz?: string[];
      uz?: string[];
      ru?: string[];
    };
  };
}

export interface Question {
  id: number;
  text: string;
  image?: string;
  correctAnswer: number;
  answers: { id: number; text: string }[];
  explanation?: string | null;
  videoUrl?: string | null;
}

function resolveImagePath(imageValue: string, imagePrefix: string): string {
  if (imageValue.startsWith("http")) return imageValue;
  const basename = imageValue.split("/").pop()?.replace(/\.[^.]+$/, "");
  if (!basename) return imageValue;
  // Prefer local webp under imagePrefix (e.g. /rasm3/)
  return `${imagePrefix}${basename}.webp`;
}

function getBodyText(body: { order?: number; type: number; value: string }[]): string {
  return body
    .filter((item) => item.type === 1)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((item) => item.value)
    .join(" ");
}

function getBodyImage(
  body: { order?: number; type: number; value: string }[],
  imagePrefix: string
): string | undefined {
  const imageItem = body.find((item) => item.type === 2);
  if (!imageItem?.value) return undefined;
  const raw = String(imageItem.value);
  // Keep absolute remote URLs as-is (fallback if local missing)
  if (raw.startsWith("http")) return raw;
  return resolveImagePath(raw, imagePrefix);
}

export function extractRawQuestions(jsonData: unknown): unknown[] {
  if (!jsonData || typeof jsonData !== "object") return [];

  const data = jsonData as Record<string, unknown>;
  const nestedData = data.data as Record<string, unknown> | undefined;

  if (nestedData?.questions && Array.isArray(nestedData.questions)) {
    return nestedData.questions;
  }
  if (Array.isArray(data.data)) {
    return data.data;
  }
  if (Array.isArray(jsonData)) {
    return jsonData;
  }
  if (Array.isArray(data.questions)) {
    return data.questions;
  }

  return [];
}

export function transformQuestion(
  q: Record<string, unknown>,
  idx: number,
  questionLang: "oz" | "uz" | "ru",
  imagePrefix: string
): Question {
  const explanation =
    typeof q.answer_description === "string" ? q.answer_description : null;
  const videoUrl = typeof q.answer_video === "string" ? q.answer_video : null;

  // Format 5: API format (n1.json) — body / answers / check
  if (Array.isArray(q.body) && Array.isArray(q.answers)) {
    const answers = q.answers as { check?: number; body: { type: number; value: string; order?: number }[] }[];
    const correctIndex = answers.findIndex((a) => a.check === 1);

    return {
      id: idx + 1,
      text: getBodyText(q.body as { type: number; value: string; order?: number }[]),
      image: getBodyImage(q.body as { type: number; value: string; order?: number }[], imagePrefix),
      correctAnswer: correctIndex >= 0 ? correctIndex + 1 : 1,
      answers: answers.map((answer, i) => ({
        id: i + 1,
        text: getBodyText(answer.body),
      })),
      explanation,
      videoUrl,
    };
  }

  // Format 4: n*.json — { id, question, image, options }
  if (Array.isArray(q.options) && !q.content && !q.choises) {
    const options = q.options as { text: string; is_correct?: boolean }[];
    const correctOption = options.find((o) => o.is_correct === true);
    const correctIndex = correctOption ? options.indexOf(correctOption) : 0;
    let imagePath: string | undefined;

    if (q.image) {
      imagePath = resolveImagePath(String(q.image), imagePrefix);
    }

    return {
      id: idx + 1,
      text: String(q.question ?? ""),
      image: imagePath,
      correctAnswer: correctIndex + 1,
      answers: options.map((o, i) => ({ id: i + 1, text: o.text })),
      explanation,
      videoUrl,
    };
  }

  // Format 3: barcha.json
  const content = q.content as
    | {
        uz_lat?: { text: string; options: { id: number; text: string; is_correct: boolean }[] };
        uz_cyr?: { text: string; options: { id: number; text: string; is_correct: boolean }[] };
        ru?: { text: string; options: { id: number; text: string; is_correct: boolean }[] };
      }
    | undefined;

  if (content && (content.uz_lat || content.uz_cyr || content.ru)) {
    const langKey = questionLang === "oz" ? "uz_lat" : questionLang === "uz" ? "uz_cyr" : "ru";
    const langContent = content[langKey] || content.uz_lat || content.uz_cyr || content.ru!;
    const correctOption = langContent.options.find((o) => o.is_correct);
    const correctAnswer = correctOption ? correctOption.id : 1;
    let imagePath: string | undefined;

    if (typeof q.media_url === "string" && q.media_url.trim()) {
      imagePath = q.media_url.startsWith("http") ? q.media_url : `${imagePrefix}${q.media_url}`;
    }

    return {
      id: idx + 1,
      text: langContent.text,
      image: imagePath,
      correctAnswer,
      answers: langContent.options.map((o) => ({ id: o.id, text: o.text })),
      explanation,
      videoUrl,
    };
  }

  // Format 2: 700baza.json
  if (Array.isArray(q.choises)) {
    const choises = q.choises as { text: string; answer: boolean }[];
    const correctIndex = choises.findIndex((c) => c.answer === true);
    let imagePath: string | undefined;
    const media = q.media as { exist?: boolean; name?: string } | undefined;

    if (media?.exist && media?.name) {
      imagePath = `${imagePrefix}${media.name}.png`;
    } else if (q.image) {
      imagePath = `${imagePrefix}${q.image}`;
    }

    return {
      id: idx + 1,
      text: String(q.question ?? ""),
      image: imagePath,
      correctAnswer: correctIndex + 1,
      answers: choises.map((choice, ansIdx) => ({
        id: ansIdx + 1,
        text: choice.text,
      })),
      explanation,
      videoUrl,
    };
  }

  // Format 1: legacy nested format
  const typedQ = q as unknown as QuestionDataFormat1;
  const answerLang = questionLang;
  const questionObj = typedQ.question;
  const legacyAnswers =
    typedQ.answers?.answer?.[answerLang] ||
    typedQ.answers?.answer?.uz ||
    typedQ.answers?.answer?.oz ||
    [];
  const questionText =
    typeof questionObj === "string"
      ? questionObj
      : questionObj?.[answerLang] || questionObj?.uz || questionObj?.oz || "";
  const photoField = typedQ.photo || typedQ.image;

  return {
    id: idx + 1,
    text: questionText,
    image: photoField ? `${imagePrefix}${photoField}` : undefined,
    correctAnswer: typedQ.answers?.status || 1,
    answers: legacyAnswers.map((answerText, ansIdx) => ({
      id: ansIdx + 1,
      text: answerText,
    })),
    explanation,
    videoUrl,
  };
}

export function parseTestQuestions(
  jsonData: unknown,
  questionLang: "oz" | "uz" | "ru",
  imagePrefix: string,
  questionCount: number,
  randomize: boolean,
  shuffleArray: <T>(array: T[]) => T[]
): Question[] {
  const rawArray = extractRawQuestions(jsonData);

  if (rawArray.length === 0) {
    return [];
  }

  const selectedQuestions = randomize
    ? shuffleArray(rawArray).slice(0, questionCount)
    : rawArray.slice(0, questionCount);

  return selectedQuestions.map((q, idx) =>
    transformQuestion(q as Record<string, unknown>, idx, questionLang, imagePrefix)
  );
}

export function formatExplanation(text: string): string[] {
  return text
    .split(/\r?\n\r?\n|\r?\n/)
    .map((part) => part.trim())
    .filter(Boolean);
}
