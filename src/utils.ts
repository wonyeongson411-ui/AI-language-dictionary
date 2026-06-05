import { DefinitionResult } from './types';

export const LANGUAGES = [
  '中文',
  'English',
  '日本語',
  '한국어',
  'Español',
  'Français',
  'Deutsch',
  'Русский',
  'العربية',
  'Português',
];

export const MOCK_DICTIONARY: Record<string, DefinitionResult> = {
  "설렘": {
    wordInTarget: "설렘",
    coreExplanation: "形容心里扑通扑通跳、非常期待和激动的状态。通常用在遇到喜欢的人、准备去旅行，或者马上要经历什么好事的时候。",
    usageContext: {
      scenarios: ["日常聊天", "恋爱", "旅行前", "SNS"],
      tone: "感性、亲近、带有积极情绪"
    },
    examples: [
      { type: "simple", target: "설렘을 느껴요.", native: "感觉很心动。" },
      { type: "natural", target: "첫 데이트라 그런지 너무 설레요.", native: "可能是因为第一次约会，心里特别激动（心动）。" },
      { type: "advanced", target: "여행을 떠나기 전날 밤의 설렘은 언제나 기분 좋습니다.", native: "出发旅行前一晚的激动心情，总是让人感觉很好。" }
    ],
    synonyms: [
      { word: "두근거림", difference: "更强调物理上的心脏跳动（扑通扑通），而설렘更侧重于情绪上的期待和激动。" },
      { word: "기대", difference: "就是中性的“期待”，没有설렘那种带有心跳加速的情感色彩。" }
    ],
    collocations: [
      { phrase: "설렘 반 두려움 반", explanation: "既期待又害怕、一半激动一半紧张。", example: "새로운 시작은 늘 설렘 반 두려움 반이다." },
      { phrase: "가슴이 설레다", explanation: "心里小鹿乱撞、心中充满期待。", example: "그의 목소리를 들으니 가슴이 설렌다." }
    ],
    commonMistake: {
      wrong: "이 영화 너무 설레요. (形容电影)",
      right: "이 영화를 보니 너무 설레요.",
      reason: "설레다 是用来表现人的内心状态的，不能直接用来形容物品（比如电影、礼物）。"
    },
    memoryAid: "想象外面下着雪（설），你在屋里等着喜欢的人来，内心充满了浪漫和心跳的感觉。",
    pronunciationTip: "发音时注意收音 [설렘]，读起来连贯流畅。"
  },
  "눈치": {
    wordInTarget: "눈치",
    coreExplanation: "所谓的“眼力见儿”。指察言观色、感知周围氛围或别人情绪的能力。韩国社会非常看重这个品质。",
    usageContext: {
      scenarios: ["职场", "聚会", "日常人际交往"],
      tone: "口语、自然、有时带贬义（指没有眼力见时）"
    },
    examples: [
      { type: "simple", target: "눈치가 없어요.", native: "没有眼力见儿。" },
      { type: "natural", target: "분위기 보니까 눈치껏 빠져야겠네.", native: "看这氛围，我得识趣点儿溜了。" },
      { type: "advanced", target: "사회생활을 잘하려면 어느 정도 눈치가 있어야 합니다.", native: "要想在社会上混得开，多多少少得有点眼力见才行。" }
    ],
    synonyms: [
      { word: "센스", difference: "센스(Sense)更偏向于品味、情商或机智，而눈치单指“察言观色”的能力。" }
    ],
    collocations: [
      { phrase: "눈치가 빠르다", explanation: "眼力见好，反应快。", example: "그 사람은 눈치가 빨라서 상황 파악을 잘한다." },
      { phrase: "눈치를 보다", explanation: "看别人的脸色行事。", example: "상사 눈치를 보느라 퇴근을 못 하고 있다." }
    ],
    commonMistake: {
      wrong: "그는 눈치가 나빠요.",
      right: "그는 눈치가 없어요.",
      reason: "搭配上不习惯说 '눈치가 나쁘다' (眼色坏)，而是常说 '눈치가 없다' (没有眼色) 或者 '눈치가 빠르다' (眼色快)。"
    },
    memoryAid: "用眼睛（눈）看别人然后打个喷嚏（치!），比喻通过看别人的眼神迅速作出反应。",
    pronunciationTip: "标准的平音，注意不要读成重音。"
  },
  "답답하다": {
    wordInTarget: "답답하다",
    coreExplanation: "形容物理上“闷、不透气”，或者心理上“郁闷、憋屈、沟通不畅”的感觉。也常用来形容某人做事磨叽、死板、不开窍。",
    usageContext: {
      scenarios: ["诉苦", "工作抱怨", "日常聊天"],
      tone: "发泄不满、自然、偏口语带有情感色彩"
    },
    examples: [
      { type: "simple", target: "가슴이 답답해요.", native: "心里很闷（很郁闷）。" },
      { type: "natural", target: "말이 안 통해서 너무 답답해.", native: "因为语言不通，真是急死我了（太憋屈了）。" },
      { type: "advanced", target: "창문을 닫아두었더니 공기가 답답하게 느껴집니다.", native: "因为把窗户关上了，感觉空气很不流通（很闷）。" }
    ],
    synonyms: [
      { word: "속상하다", difference: "속상하다 是单纯的“伤心、难过”，属于心理受伤；답답하다 是“闷、急人、憋屈”，属于一种情绪无法抒发的抓狂感。" }
    ],
    collocations: [
      { phrase: "답답한 사람", explanation: "死心眼、不懂变通或反应慢的人。", example: "그는 가끔 너무 답답한 사람이다." },
      { phrase: "속이 답답하다", explanation: "心里堵得慌。", example: "억울한 일을 당해서 속이 너무 답답하다." }
    ],
    commonMistake: {
      wrong: "나는 답답한 기분이다.",
      right: "나는 기분이 답답하다.",
      reason: "习惯直接做谓语（답답하다），不建议作为修饰语套用中式韩语。"
    },
    memoryAid: "想象你回答（답）别人的时候，无论怎么回答对方都不明白，这时候你心里就觉得很憋屈（답답하다）。",
    pronunciationTip: "注意连读和紧张音化，发音偏向 [답따파다]。"
  },
  "트렌드": {
    wordInTarget: "트렌드",
    coreExplanation: "即英文单词 Trend，表示当下的潮流、趋势、动向。在韩国无论是时尚、商业还是日常用语中都非常高频使用。",
    usageContext: {
      scenarios: ["时尚", "职场分享", "年轻人社交"],
      tone: "时髦、偏正式/书面也常用于口语"
    },
    examples: [
      { type: "simple", target: "이게 요즘 트렌드예요.", native: "这就是最近的潮流。" },
      { type: "natural", target: "트렌드는 진짜 빨리 바뀌는 것 같아.", native: "潮流变得可真快啊。" },
      { type: "advanced", target: "이번 기획안은 최신 소비 트렌드를 반영하여 작성되었습니다.", native: "这份企划案反映了最新的消费趋势而撰写。" }
    ],
    synonyms: [
      { word: "유행", difference: "유행(流行)比较传统，指一段时间内大众喜欢的东西；트렌드 更具时代感、更宏大，多用于产业分析、商业或极度前沿的时尚。" }
    ],
    collocations: [
      { phrase: "트렌드를 따라가다", explanation: "跟上潮流。", example: "요즘은 트렌드를 따라가기도 벅차다." },
      { phrase: "트렌드를 이끌다", explanation: "引领潮流。", example: "우리 회사는 새로운 트렌드를 이끌어간다." }
    ],
    commonMistake: null,
    memoryAid: "英文“Trend”的直接音译，发音读快了就记住啦。",
    pronunciationTip: "注意按照韩式英语发音为 [트렌드]。"
  },
  "분위기": {
    wordInTarget: "분위기",
    coreExplanation: "氛围、气氛。可以指一个地方的环境感觉（比如餐厅很有情调），也可以指一群人在一起时的感觉（比如会议气氛很紧张）。",
    usageContext: {
      scenarios: ["探店", "聚餐评论", "团队建设"],
      tone: "自然、通用"
    },
    examples: [
      { type: "simple", target: "여기 분위기 너무 좋다.", native: "这里气氛（环境）真好。" },
      { type: "natural", target: "오늘 회의 분위기 왜 이렇게 싸해?", native: "今天开会的气氛怎么这么冷清（僵硬）？" },
      { type: "advanced", target: "음악은 카페의 전반적인 분위기를 좌우하는 중요한 요소입니다.", native: "音乐是左右一家咖啡店整体氛围的重要元素。" }
    ],
    synonyms: [
      { word: "무드", difference: "무드(Mood)偏向于个人的情绪或某种艺术化的情调，而분위기适用范围更广，不仅包含情调，还包含物理空间和社会交际场合的整体感受。" }
    ],
    collocations: [
      { phrase: "분위기를 띄우다", explanation: "活跃气氛。", example: "그 친구는 분위기를 띄우는 데 선수다." },
      { phrase: "분위기를 파악하다", explanation: "察觉气氛。", example: "분위기를 파악하고 적절하게 행동해야 한다." }
    ],
    commonMistake: {
      wrong: "이 카페는 느낌이 좋다.",
      right: "이 카페는 분위기가 좋다.",
      reason: "在形容餐厅、咖啡店的感觉/格调时，韩国人更常用 분위기 而不是 느낌。"
    },
    memoryAid: "分手（분）为了（위）一种不同的气氛，可以联想到改变环境氛围。",
    pronunciationTip: "第二个字是 [위]，整体读起来自然连贯。"
  }
};

export async function fetchDefinition(text: string, nativeLanguage: string, targetLanguage: string) {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 600));
  
  const trimmed = text.trim();
  if (MOCK_DICTIONARY[trimmed]) {
    return MOCK_DICTIONARY[trimmed];
  }
  
  throw new Error('未收录');
}

export async function fetchStory(words: string[], nativeLanguage: string, targetLanguage: string) {
  await new Promise((r) => setTimeout(r, 1000));
  return {
    text: `今天去咖啡店，里面的 **분위기** 真的特别好！服务员端咖啡来的手都在抖，看来他也有些 **설렘**。我本来因为工作有点 **답답하다**，但看到大家这么开心，我也就有了 **눈치**，跟着聊起了最近的 **트렌드**。希望明天也一样开心！`
  };
}

export async function fetchChatResponse(message: string, contextWord: string, nativeLanguage: string, targetLanguage: string, history: any[]) {
  await new Promise((r) => setTimeout(r, 800));
  return {
    text: `哈哈，很好的问题！"${contextWord}" 这个词在很多场合都非常实用。既然你问到 "${message}"，我可以告诉你：在韩国人日常聊天中，大家通常会非常自然地带入这个词。你还可以多试着用它造个句子，我会帮你看看准不准确哦！`
  };
}

export async function fetchQuiz(words: any[]) {
  await new Promise((r) => setTimeout(r, 1000));
  return {
    questions: [
      {
        type: "multiple_choice",
        questionText: "在形容餐厅环境非常好时，我们通常会说这里有什么好？",
        options: ["느낌 (感觉)", "분위기 (氛围)", "기분 (心情)", "마음 (内心)"],
        correctAnswer: "분위기 (氛围)",
        explanation: "在描述物理空间或者人群聚集时的气氛、情调，韩语中最常用的是 분위기。"
      },
      {
        type: "fill_blank",
        questionText: "상사 ___를 보느라 퇴근을 못 하고 있다. (因为看上司的眼色行事，所以没法下班。)",
        options: ["눈", "눈치", "마음", "성격"],
        correctAnswer: "눈치",
        explanation: "看别人的眼色行事，搭配词是 '눈치를 보다'。"
      },
      {
        type: "listening",
        questionText: "听这段发音，选择对应的词汇：",
        options: ["설렘", "눈치", "트렌드", "답답하다"],
        correctAnswer: "답답하다",
        explanation: "这个词形容心理上郁闷憋屈，或者沟通不畅的样子。"
      },
      {
        type: "sentence_completion",
        questionText: "初次相亲约会前，女生感受到的心跳加速，用哪个词最合适？",
        options: ["속상하다", "답답하다", "설렘", "눈치"],
        correctAnswer: "설렘",
        explanation: "설렘专门指因为期待、激动而心跳加速的感觉，多用于美好、暧昧的情景中。"
      }
    ]
  };
}
