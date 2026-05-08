/**
 * @file noteData.ts
 * @description 향수의 주요 원료(Notes)에 대한 상세 설명을 담은 데이터베이스입니다.
 * 글로벌 럭셔리 브랜드들의 시그니처 원료들을 포함하여 16:16:16 비율로 구성합니다.
 */

export interface ScentNote {
  name: string;
  enName: string;
  category: "Top" | "Middle" | "Base";
  description: string;
  origin: string;
}

export const scentNotes: ScentNote[] = [
  // --- TOP NOTES (16) ---
  {
    name: "베르가못",
    enName: "Bergamot",
    category: "Top",
    description: "우아하고 화사한 감귤 향. 얼그레이 홍차의 풍미를 만드는 주인공으로 기분을 밝게 전환해 줍니다.",
    origin: "이탈리아산 감귤류 과일"
  },
  {
    name: "네롤리",
    enName: "Neroli",
    category: "Top",
    description: "오렌지 꽃의 싱그러운 향. 순수한 햇살 아래 하얀 꽃잎처럼 깨끗하고 로맨틱한 분위기를 만듭니다.",
    origin: "비터 오렌지 나무의 꽃"
  },
  {
    name: "핑크 페퍼",
    enName: "Pink Pepper",
    category: "Top",
    description: "톡 쏘는 발랄함과 섬세한 스파이스 향. 향기의 시작에 생동감 넘치는 현대적인 리듬을 부여합니다.",
    origin: "브라질산 페퍼 트리 열매"
  },
  {
    name: "레몬",
    enName: "Lemon",
    category: "Top",
    description: "날카롭고 선명한 산미가 느껴지는 향. 지친 감각에 즉각적인 리프레시와 밝은 에너지를 선사합니다.",
    origin: "시칠리아산 레몬 껍질"
  },
  {
    name: "알데하이드",
    enName: "Aldehyde",
    category: "Top",
    description: "갓 세탁한 셔츠에서 날 법한 깨끗한 비누 향. 샤넬 N°5를 탄생시킨 현대 조향의 혁신적인 성분입니다.",
    origin: "합성 향료 원료"
  },
  {
    name: "주니퍼 베리",
    enName: "Juniper Berry",
    category: "Top",
    description: "진(Gin) 술 특유의 시원하고 알싸한 향. 차가운 새벽 공기 같은 청량함과 지적인 분위기를 자아냅니다.",
    origin: "주니퍼 나무의 열매"
  },
  {
    name: "페어",
    enName: "Pear",
    category: "Top",
    description: "달콤하고 시원한 서양배의 과즙 향. 조말론의 시그니처로 잘 알려진 투명하고 신선한 가을의 향기입니다.",
    origin: "신선한 서양배 추출물"
  },
  {
    name: "파인애플",
    enName: "Pineapple",
    category: "Top",
    description: "트로피컬한 활기와 고급스러운 달콤함. 크리드 어벤투스의 상징으로 성공한 남성의 자신감을 표현합니다.",
    origin: "열대 과일 파인애플"
  },
  {
    name: "만다린",
    enName: "Mandarin",
    category: "Top",
    description: "자극적이지 않고 부드러운 귤의 단맛. 시로(Shiro) 특유의 깨끗하고 포근한 시트러스 무드를 만듭니다.",
    origin: "지중해 연안 귤 껍질"
  },
  {
    name: "사프란",
    enName: "Saffron",
    category: "Top",
    description: "금보다 비싼 향료로 불리는 이국적인 향. 씁쓸하면서도 금속적인 광택감이 느껴지는 럭셔리한 향입니다.",
    origin: "크로커스 꽃의 암술대"
  },
  {
    name: "민트",
    enName: "Mint",
    category: "Top",
    description: "얼음처럼 차갑고 상쾌한 허브 향. 러쉬(Lush) 더티의 주인공으로 정체된 감각을 깨워주는 허브입니다.",
    origin: "박하 식물의 잎"
  },
  {
    name: "블랙 페퍼",
    enName: "Black Pepper",
    category: "Top",
    description: "강렬하고 건조한 스파이스 향. 톰포드의 남성적인 향수들에서 묵직한 카리스마와 에너지를 담당합니다.",
    origin: "후추 나무의 열매"
  },
  {
    name: "자몽",
    enName: "Grapefruit",
    category: "Top",
    description: "쌉싸름한 껍질 향과 터지는 과즙의 조화. 조말론 그레이프프루트처럼 명랑하고 스포티한 느낌을 줍니다.",
    origin: "자몽 껍질 오일"
  },
  {
    name: "씨 솔트",
    enName: "Sea Salt",
    category: "Top",
    description: "바닷바람에 실려온 짭조름한 소금기. 조말론 우드세이지 앤 씨솔트의 핵심으로 자유로운 해변을 떠올리게 합니다.",
    origin: "해안가 암석과 바다 공기"
  },
  {
    name: "바질",
    enName: "Basil",
    category: "Top",
    description: "톡 쏘는 그린 허브의 반전 매력. 시트러스 향조에 예리하고 지적인 에지를 더해주는 허브입니다.",
    origin: "신선한 바질 잎"
  },
  {
    name: "카다멈",
    enName: "Cardamom",
    category: "Top",
    description: "따뜻하고 스파이시한 이국적인 풍미. 르라보 상탈33의 도입부에서 느껴지는 야성적인 세련미의 원천입니다.",
    origin: "생강과 식물의 씨앗"
  },

  // --- MIDDLE NOTES (16) ---
  {
    name: "로즈",
    enName: "Rose",
    category: "Middle",
    description: "화려하고 우아한 꽃의 여왕. 클래식한 로맨틱함부터 현대적인 시크함까지 지닌 절대적인 원료입니다.",
    origin: "터키 및 불가리아산 장미"
  },
  {
    name: "자스민",
    enName: "Jasmine",
    category: "Middle",
    description: "관능적이고 풍성한 화이트 플로럴 향. 밤의 공기처럼 신비롭고 깊은 달콤함이 입체감을 더합니다.",
    origin: "이집트 및 인도산 자스민 꽃"
  },
  {
    name: "무화과",
    enName: "Fig",
    category: "Middle",
    description: "크리미한 과육과 쌉싸름한 잎사귀 향. 딥디크 필로시코스처럼 평화롭고 지적인 여름의 정취를 담습니다.",
    origin: "무화과 열매와 잎"
  },
  {
    name: "블랙커런트",
    enName: "Blackcurrant",
    category: "Middle",
    description: "새콤달콤한 베리와 톡 쏘는 그린 노트. 딥디크 롬브로단로의 특징인 매혹적인 생명력을 표현합니다.",
    origin: "블랙커런트 열매와 싹"
  },
  {
    name: "아이리스",
    enName: "Iris",
    category: "Middle",
    description: "파우더리하고 귀족적인 보랏빛 향. 샤넬과 디올의 고급스러운 잔향을 책임지는 아주 귀한 원료입니다.",
    origin: "붓꽃의 말린 뿌리"
  },
  {
    name: "프리지아",
    enName: "Freesia",
    category: "Middle",
    description: "순수하고 깨끗한 화이트 플로럴. 조말론 잉글리쉬 페어의 정체성으로 맑은 가을 햇살 같은 향기입니다.",
    origin: "신선한 프리지아 꽃"
  },
  {
    name: "은방울꽃",
    enName: "Lily of the Valley",
    category: "Middle",
    description: "투명하고 맑은 숲속의 작은 종소리. 디올 디오리시모의 영혼으로 순수하고 깨끗한 여성미의 상징입니다.",
    origin: "뮤게(Muguet) 꽃 추출물"
  },
  {
    name: "화이트 티",
    enName: "White Tea",
    category: "Middle",
    description: "차분하고 정갈한 찻잎의 향. 불가리와 시로의 향수에서 마음을 가라앉히는 명상적인 평온함을 줍니다.",
    origin: "어린 차나무 잎"
  },
  {
    name: "편백",
    enName: "Hinoki",
    category: "Middle",
    description: "비 온 뒤 숲길의 신선한 나무 향. 이솝(Aesop) 휠(Hwyl)의 정체성으로 깊은 안식과 치유의 무드를 만듭니다.",
    origin: "일본산 편백나무 추출물"
  },
  {
    name: "라벤더",
    enName: "Lavender",
    category: "Middle",
    description: "마음을 진정시키는 허브의 대명사. 르라보 라방드31처럼 깨끗하고 중성적인 세련미를 선사합니다.",
    origin: "라벤더 꽃과 잎"
  },
  {
    name: "튜베로즈",
    enName: "Tuberose",
    category: "Middle",
    description: "중독적이고 화려한 달콤한 꽃향기. 딥디크 도손의 주인공으로 밤에 더 짙어지는 유혹적인 향기입니다.",
    origin: "월하향 꽃 추출물"
  },
  {
    name: "제라늄",
    enName: "Geranium",
    category: "Middle",
    description: "민트처럼 시원하면서도 장미의 뉘앙스를 지닌 향. 이솝의 중성적이고 이성적인 매력을 돋보이게 합니다.",
    origin: "제라늄 줄기와 잎"
  },
  {
    name: "세이지",
    enName: "Sage",
    category: "Middle",
    description: "거친 대지에서 자란 허브의 흙내음. 조말론 우드세이지의 핵심으로 자연 그대로의 생명력을 보여줍니다.",
    origin: "야생 클라리 세이지 허브"
  },
  {
    name: "로즈마리",
    enName: "Rosemary",
    category: "Middle",
    description: "머리를 맑게 해주는 예리한 허브 향. 이솝의 정원에서 느껴지는 지적이고 아로마틱한 활기를 담았습니다.",
    origin: "신선한 로즈마리 잎"
  },
  {
    name: "체리",
    enName: "Cherry",
    category: "Middle",
    description: "농염하고 달콤한 붉은 열매의 유혹. 톰포드 로스트체리처럼 도발적이고 화려한 분위기를 연출합니다.",
    origin: "블랙 체리와 시럽"
  },
  {
    name: "바이올렛",
    enName: "Violet",
    category: "Middle",
    description: "그늘에서 자란 수줍고 신비로운 꽃향. 르라보 비올렛30처럼 맑고 투명한 보랏빛 아우라를 만듭니다.",
    origin: "비올렛 꽃잎과 잎사귀"
  },

  // --- BASE NOTES (16) ---
  {
    name: "앰버",
    enName: "Amber",
    category: "Base",
    description: "따뜻하고 달콤한 수지의 향. 피부 위에 오래 머무는 포근한 온기와 성숙한 관능미를 동시에 표현합니다.",
    origin: "나무 수지(Resin)에서 유래"
  },
  {
    name: "베티버",
    enName: "Vetiver",
    category: "Base",
    description: "비 온 뒤의 흙 내음과 쌉싸름한 연기 향. 중성적이고 이성적인 매력을 가진 묵직한 우디 향의 핵심입니다.",
    origin: "열대 지방 풀의 뿌리"
  },
  {
    name: "머스크",
    enName: "Musk",
    category: "Base",
    description: "살결처럼 부드럽고 깨끗한 잔향. 모든 향기를 포근하게 감싸 안으며 신비로운 안정감을 선사합니다.",
    origin: "식물성 및 합성 향료 원료"
  },
  {
    name: "파출리",
    enName: "Patchouli",
    category: "Base",
    description: "깊고 어두운 대지의 향기. 약간의 약초 내음과 흙 향이 어우러져 빈티지한 아우라를 더합니다.",
    origin: "동남아 원산 꿀풀과 식물"
  },
  {
    name: "샌달우드",
    enName: "Sandalwood",
    category: "Base",
    description: "포근하고 크리미한 나무 향. 마음을 가라앉히는 명상적인 분위기와 고급스러운 세련미를 줍니다.",
    origin: "인도산 백단향 나무"
  },
  {
    name: "시더우드",
    enName: "Cedarwood",
    category: "Base",
    description: "건조하고 깨끗한 연필 향. 숲속에 있는 듯한 지적이고 이성적인 느낌을 주며 골격을 잡아줍니다.",
    origin: "북미 및 히말라야산 향나무"
  },
  {
    name: "바닐라",
    enName: "Vanilla",
    category: "Base",
    description: "달콤하고 부드러운 위로의 향. 포근한 안정감과 함께 미식가(Gourmand)적인 매력을 완성합니다.",
    origin: "마다가스카르산 바닐라 빈"
  },
  {
    name: "우드",
    enName: "Oud",
    category: "Base",
    description: "침향나무에서 얻는 가장 진귀한 향료. 묵직하고 어두운 나무 향과 동물적인 관능미의 신비로운 조화입니다.",
    origin: "동남아시아의 침향나무"
  },
  {
    name: "토바코",
    enName: "Tobacco",
    category: "Base",
    description: "스모키하고 묵직한 성숙한 매력. 톰포드 토바코바닐라처럼 클래식한 클럽하우스의 중후함을 떠올리게 합니다.",
    origin: "건조된 담배 잎"
  },
  {
    name: "통카빈",
    enName: "Tonka Bean",
    category: "Base",
    description: "바닐라와 아몬드를 섞은 듯한 달콤함. 샤넬의 현대적인 향수들에서 깊이 있고 따뜻한 무드를 책임집니다.",
    origin: "남미산 통카 나무 씨앗"
  },
  {
    name: "오크모스",
    enName: "Oakmoss",
    category: "Base",
    description: "이끼가 낀 숲속의 쌉싸름한 그린 향. 클래식한 시프레 향수의 핵심으로 강인하고 고급스러운 기품을 줍니다.",
    origin: "떡갈나무에 서식하는 이끼"
  },
  {
    name: "인센스",
    enName: "Incense",
    category: "Base",
    description: "신성한 사원에서 피어오르는 연기 향. 바이레도와 이솝에서 느껴지는 정적인 신비로움과 명상적인 향입니다.",
    origin: "유향 및 나무 수지"
  },
  {
    name: "참파",
    enName: "Champa",
    category: "Base",
    description: "나그참파의 주인공인 이국적인 꽃향기. 보헤미안 무드와 명상적인 평온함을 선사하는 독특한 원료입니다.",
    origin: "인도산 챔파카 꽃"
  },
  {
    name: "가이악우드",
    enName: "Guaiac Wood",
    category: "Base",
    description: "스모키하고 발삼 같은 깊은 나무 향. 르라보 가이악10처럼 투명하면서도 묵직한 아우라를 형성합니다.",
    origin: "남미산 가이악 나무"
  },
  {
    name: "가죽",
    enName: "Leather",
    category: "Base",
    description: "야성적이고 센슈얼한 가죽 특유의 향. 바이레도와 톰포드에서 느껴지는 대담하고 독보적인 카리스마입니다.",
    origin: "자작나무 타르 등 복합 향료"
  },
  {
    name: "벤조인",
    enName: "Benzoin",
    category: "Base",
    description: "바닐라처럼 달콤하면서도 따스한 수지 향. 커정의 바카라 루쥬처럼 환상적이고 고급스러운 잔향을 남깁니다.",
    origin: "안식향 나무의 수지"
  }
];
