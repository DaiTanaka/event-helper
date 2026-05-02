export type QAPair = {
  question: string
  answer: string
}

export type QATemplateGroup = {
  id: string
  label: string
  eventTypes: string[] | 'all'
  pairs: QAPair[]
}

export const QA_TEMPLATE_GROUPS: QATemplateGroup[] = [
  // ── 汎用 ─────────────────────────────────────────────────────
  {
    id: 'access',
    label: 'アクセス・会場',
    eventTypes: 'all',
    pairs: [
      { question: '会場へのアクセス方法を教えてください。', answer: '最寄り駅は○○駅です。○番出口から徒歩約○分です。詳細は公式サイトのアクセスページをご参照ください。' },
      { question: '駐車場はありますか？', answer: '会場近くに有料駐車場がございます。混雑が予想されますので、公共交通機関のご利用をお勧めします。' },
      { question: 'トイレや休憩スペースはありますか？', answer: 'トイレは会場内に複数あります。休憩スペースは○○付近に設けております。' },
    ],
  },
  {
    id: 'entry',
    label: '参加・申込',
    eventTypes: 'all',
    pairs: [
      { question: '参加するにはどうすればよいですか？', answer: '公式サイトの申込フォームからお申し込みください。定員に達し次第、受付を終了します。' },
      { question: '定員はありますか？', answer: '定員は○○名です。お早めにお申し込みください。' },
      { question: 'キャンセルはできますか？', answer: '○○日前までのキャンセルは無料で承ります。それ以降のキャンセルはキャンセルポリシーに基づき対応いたします。' },
    ],
  },
  {
    id: 'items',
    label: '持ち物・服装',
    eventTypes: 'all',
    pairs: [
      { question: '当日の服装について教えてください。', answer: '特に制限はありませんが、動きやすい服装でお越しください。屋外の場合は天候に合わせた服装をお勧めします。' },
      { question: '持ち物はありますか？', answer: '申込時に送付した参加票（QRコード）をご持参ください。その他必要なものは事前にご案内します。' },
      { question: '飲食物の持ち込みはできますか？', answer: '会場内での飲食は指定エリアのみ可能です。市販のペットボトル飲料はお持ち込みいただけます。' },
    ],
  },

  // ── 企業・社内イベント ────────────────────────────────────────
  {
    id: 'corporate_fee',
    label: '費用・精算',
    eventTypes: ['corporate_party'],
    pairs: [
      { question: '参加費はかかりますか？', answer: '会社負担のため、個人での参加費は不要です。' },
      { question: '交通費は支給されますか？', answer: '所定の交通費精算フォームにご記入の上、○○までご提出ください。' },
      { question: '欠席した場合、費用は返金されますか？', answer: '直前のキャンセルは手配済みの飲食費に影響するため、欠席の場合は必ず○○日前までにご連絡ください。' },
    ],
  },
  {
    id: 'corporate_absence',
    label: '欠席・遅刻',
    eventTypes: ['corporate_party'],
    pairs: [
      { question: '欠席する場合はどうすればよいですか？', answer: '担当者（○○）まで○○日前までにご連絡ください。当日の急なご欠席の場合もご連絡をお願いします。' },
      { question: '遅刻した場合はどうすればよいですか？', answer: '遅刻される場合は担当者（○○）へ事前にご連絡ください。受付は開始から○○分間対応しています。' },
    ],
  },

  // ── 学校・教育イベント ────────────────────────────────────────
  {
    id: 'school_parent',
    label: '保護者・見学',
    eventTypes: ['school_event'],
    pairs: [
      { question: '保護者は参加・見学できますか？', answer: '保護者の方も○○エリアからご見学いただけます。入場には事前の申込が必要です。' },
      { question: '写真・動画の撮影はできますか？', answer: '個人の思い出用の撮影は可能ですが、他の参加者が映り込む場合はご配慮ください。SNSへの投稿は禁止とさせていただきます。' },
      { question: '悪天候の場合、開催はどうなりますか？', answer: '荒天の場合は開催場所を○○に変更します。中止の場合は当日○時までに公式サイト・メールでお知らせします。' },
    ],
  },
  {
    id: 'school_items',
    label: '持ち物・準備',
    eventTypes: ['school_event'],
    pairs: [
      { question: '必要な持ち物を教えてください。', answer: '参加通知書、上履き（○○の場合）、お弁当・水筒をご持参ください。詳細は参加案内をご確認ください。' },
      { question: '服装の指定はありますか？', answer: '学校の制服または体操服でご参加ください。動きやすい運動靴を着用してください。' },
    ],
  },

  // ── 地域・自治体イベント ──────────────────────────────────────
  {
    id: 'festival_vendor',
    label: '出店・ブース',
    eventTypes: ['community_festival'],
    pairs: [
      { question: '出店・ブース出展を申し込むにはどうすればよいですか？', answer: '出店申込フォームよりお申し込みください。締め切りは○○月○○日です。審査の上、結果をメールにてお知らせします。' },
      { question: '搬入・搬出の時間帯を教えてください。', answer: '搬入は開催前日○時〜○時、当日は開場の○時間前から可能です。搬出は閉幕後○時間以内にお願いします。' },
      { question: 'テントや机・椅子のレンタルはありますか？', answer: 'テント（○×○m）、折りたたみ机、パイプ椅子をレンタルできます。数量に限りがあるため、申込時にご予約ください。' },
    ],
  },
  {
    id: 'festival_rain',
    label: '荒天・中止対応',
    eventTypes: ['community_festival'],
    pairs: [
      { question: '雨天の場合、開催はどうなりますか？', answer: '小雨程度であれば予定通り開催します。荒天の場合は○○に変更、または中止とします。' },
      { question: '中止の場合はどのように告知されますか？', answer: '当日○時を目安に、公式SNS・公式サイト・地域の広報でお知らせします。' },
    ],
  },

  // ── 商業施設イベント ──────────────────────────────────────────
  {
    id: 'commercial_ticket',
    label: '整理券・入場',
    eventTypes: ['commercial_facility'],
    pairs: [
      { question: '整理券・優先入場券は配布されますか？', answer: '当日○時より○○で先着○名様に整理券を配布します。整理券がないと参加いただけない場合があります。' },
      { question: '開場前から並べますか？', answer: '館内での長時間の列形成はご遠慮ください。整理券は開場○時間前から配布します。' },
      { question: '混雑時の入場制限はありますか？', answer: '会場の定員に達した場合、一時的に入場をお待ちいただくことがあります。混雑時は係員の誘導にしたがってください。' },
    ],
  },
  {
    id: 'commercial_parking',
    label: '駐車場・交通',
    eventTypes: ['commercial_facility'],
    pairs: [
      { question: '駐車場はありますか？駐車料金の割引はありますか？', answer: '施設内駐車場をご利用いただけます。イベント参加の方は、スタンプまたはレシート提示で○時間無料となります。' },
      { question: '公共交通機関でのアクセスを教えてください。', answer: '○○線○○駅から徒歩○分です。バスをご利用の場合は○○停留所をご利用ください。' },
    ],
  },

  // ── スポーツ・アウトドア ──────────────────────────────────────
  {
    id: 'sports_cancel',
    label: '荒天・中止',
    eventTypes: ['sports'],
    pairs: [
      { question: '悪天候の場合、開催はどうなりますか？', answer: '警報発令時は中止とします。注意報程度であれば状況を見て判断します。最終判断は当日○時に行います。' },
      { question: '中止・延期の連絡はいつ、どのようにされますか？', answer: '当日○時を目安に、参加者へのメール・公式SNSでお知らせします。前日の○時に一次判断をお知らせする場合もあります。' },
    ],
  },
  {
    id: 'sports_registration',
    label: '参加資格・チーム',
    eventTypes: ['sports'],
    pairs: [
      { question: '参加に年齢制限はありますか？', answer: '○歳以上の方がご参加いただけます。未成年の方は保護者の同意書が必要です。' },
      { question: 'チームでの参加はできますか？', answer: 'チーム参加は○名〜○名で受け付けています。チームの代表者がまとめて申し込みください。' },
      { question: '保険への加入は必要ですか？', answer: '大会保険に一括加入いたします（参加費に含む）。重篤な持病等がある場合は事前にご相談ください。' },
    ],
  },

  // ── 展示会・見本市 ────────────────────────────────────────────
  {
    id: 'exhibition_entry',
    label: '入場登録・料金',
    eventTypes: ['exhibition'],
    pairs: [
      { question: '入場に事前登録は必要ですか？', answer: '事前登録を推奨しております。当日登録も可能ですが、混雑緩和のため公式サイトからの事前登録をお願いします。' },
      { question: '入場料はかかりますか？', answer: '一般：○○円、学生：○○円（学生証提示）、招待状持参の方：無料です。' },
      { question: '撮影・録音はできますか？', answer: '展示物の撮影は各ブースの出展社の許可が必要です。講演・セミナーの録音・録画は禁止です。' },
    ],
  },
  {
    id: 'exhibition_exhibit',
    label: '出展・商談',
    eventTypes: ['exhibition'],
    pairs: [
      { question: '出展を申し込むにはどうすればよいですか？', answer: '出展申込書を公式サイトよりダウンロードの上、○○宛にご提出ください。締め切りは○○月○○日です。' },
      { question: '商談スペースは利用できますか？', answer: '商談スペースを会場内に設けております。事前予約制です。お問い合わせフォームよりご予約ください。' },
    ],
  },
]

export function getTemplatesForEventType(eventType: string | null | undefined): QATemplateGroup[] {
  if (!eventType) return QA_TEMPLATE_GROUPS.filter(g => g.eventTypes === 'all')
  return QA_TEMPLATE_GROUPS.filter(
    g => g.eventTypes === 'all' || (g.eventTypes as string[]).includes(eventType)
  )
}
