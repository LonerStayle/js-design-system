// DIRECTION.md 세계관 및 장면 시나리오 정본. 웹의 개별 오버레이 오기는 사용하지 않는다.
abstract final class PanpanFacts {
  static const brand = '판판레코드',
      date = '2026년 10월 10일 토요일',
      shortDate = '10.10 토',
      owner = '오세진',
      operator = '문지호';
  static const address = '서울 마포구 망원로7길 41, 지하 1층';
  static const revenue = '₩18,420,000', target = '₩20,000,000', progress = .921;
  static const concert = '판판 라이브 #118',
      concertDate = '10월 24일(토) 20:00',
      seats = '38 / 40석',
      artist = '흑백전화',
      album = '지하 3층',
      albumId = 'PP-0412',
      price = '₩38,000',
      format = '12인치 180g 재발매';
  static const usedPrice = '₩32,000',
      usedGrade = 'NM',
      secondAlbum = '모래사장 〈썰물〉',
      secondId = 'PP-0398';
  static const hours = [
    ('화–목', '13:00–21:00'),
    ('금', '13:00–23:00'),
    ('토', '12:00–21:00'),
    ('일', '12:00–20:00'),
    ('월', '정기 휴무'),
  ];
  static const staff = [
    ('오세진', '사장 · 셀렉터'),
    ('한도윤', '매입 검수'),
    ('배수아', '공연 기획'),
    ('문지호', '온라인 운영'),
  ];
  static const crates = ['C-03', 'C-04', 'C-05', 'C-06', 'C-07'];
  static const inquiries = [
    ('매입', '중고 LP 42장 매입 견적 요청', '재즈 위주'),
    ('예매', '#118 단체 예매 6석 가능할까요', '판판 라이브'),
    ('주문', '모래사장 7인치 재입고 언제?', 'PP-0398 · 썰물'),
  ];
  static const closure = '10월 15일(목)', intake = '화·목 13:00–19:00';
}
