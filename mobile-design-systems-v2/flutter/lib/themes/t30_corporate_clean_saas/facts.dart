// DIRECTION.md 세계관·장면 시나리오의 정본 데이터.
abstract final class LedgerFacts {
  static const brand = 'ledgerline',
      company = '㈜한결물산',
      date = '2026년 10월 28일 수요일',
      shortDate = '10월 28일(수)',
      closing = '10월 31일',
      total = '₩184,320,500';
  static const owner = '김하늘',
      ownerRole = '경영지원팀 매니저',
      reviewer = '박도윤',
      reviewerRole = '재무팀장',
      director = '이서진',
      author = '최민재';
  static const document = 'EXP-2610-0412',
      approval = 'APV-2610-0087',
      merchant = '도담한정식 광화문',
      purpose = '거래처 접대',
      amount = '₩186,000',
      account = '접대비',
      card = 'CARD ****-4821';
  static const pending = 12,
      missing = 37,
      employees = 214,
      cards = 86,
      salesBudget = .92;
  static const rules = [
    ('₩500,000 이하', '팀장 전결'),
    ('₩5,000,000 이하', '팀장 → 재무팀장'),
    ('₩5,000,000 초과', '팀장 → 재무팀장 → 대표이사'),
  ];
  static const accounts = [
    '복리후생비',
    '여비교통비',
    '접대비',
    '회의비',
    '소모품비',
    '도서인쇄비',
    '통신비',
    '차량유지비',
  ];
}
