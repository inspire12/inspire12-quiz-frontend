1. MySQL 8.0에서 기본 저장 엔진은 무엇인가?
A. MyISAM
B. InnoDB
C. MEMORY
D. CSV

정답: B
해설: MySQL 8.0은 기본적으로 InnoDB를 사용하며, 트랜잭션, MVCC, 외래 키 등을 지원함.
출제 이유: 아직도 MyISAM을 기본으로 알고 있는 사람이 있어, 버전별 차이를 명확히 이해시키기 위함.

2. MySQL 8.0에서 정렬 기준 및 문자열 비교 방식인 기본 collation은?
A. utf8mb4_general_ci
B. latin1_swedish_ci
C. utf8mb4_unicode_ci
D. utf8mb4_0900_ai_ci

정답: D
해설: MySQL 8.0은 Unicode 9.0을 기반으로 한 utf8mb4_0900_ai_ci를 기본 collation으로 사용함.
출제 이유: 문자 비교 정확도가 높아진 collation이 적용됐다는 점을 초보자에게 인지시키기 위함.

3. MySQL 8.0에서 도입된 비밀번호 암호화 기본 플러그인은?
A. mysql_old_password
B. sha1_password
C. caching_sha2_password
D. native_password

정답: C
해설: 8.0부터 caching_sha2_password가 기본 인증 플러그인으로 보안성이 향상됨.
출제 이유: MySQL 5.x와 접속 호환성 이슈가 자주 발생하므로 인증 플러그인의 변경 사실을 알릴 필요 있음.

4. MySQL 8.0에서 추가된 JSON 관련 기능이 아닌 것은?
A. JSON_TABLE
B. JSON_ARRAYAGG
C. JSON_VALUE
D. JSON_REPLACE

정답: C
해설: JSON_VALUE는 Oracle SQL의 함수이며, MySQL 8.0에서는 지원되지 않음.
출제 이유: JSON 기능이 많아졌지만 Oracle이나 SQL Server와 헷갈리는 경우가 많아 확인 필요.

5. MySQL 8.0에서 외래 키 제약조건을 생성하려면 어떤 저장 엔진을 써야 하는가?
A. MEMORY
B. MyISAM
C. InnoDB
D. CSV

정답: C
해설: 외래 키는 InnoDB에서만 지원됨. MyISAM 등은 무시함.
출제 이유: 초보자가 외래 키가 설정되지 않는 이유를 몰라 헤매는 경우가 많기 때문.

6. 다음 중 MySQL 8.0에서 추가된 윈도우 함수는?
A. GROUP_CONCAT
B. LEAD
C. COUNT(*)
D. FORMAT

정답: B
해설: LEAD, LAG, ROW_NUMBER, RANK 등의 윈도우 함수가 8.0부터 지원됨.
출제 이유: 윈도우 함수는 SQL 분석에 매우 유용하며 8.0부터 공식 지원되므로 반드시 소개해야 함.

7. MySQL 8.0에서 시스템 설정을 변경하고 영구 저장하기 위한 새로운 명령은?
A. SET @variable = value
B. ALTER VARIABLE
C. SET PERSIST
D. CONFIGURE

정답: C
해설: SET PERSIST는 설정을 mysqld-auto.cnf에 저장해서 재시작 후에도 유지되게 함.
출제 이유: my.cnf 편집 없이도 설정을 영구화할 수 있는 편리한 기능 소개를 위해 출제함.

8. MySQL 8.0에서 INFORMATION_SCHEMA보다 더 빠른 메타데이터 조회 시스템은?
A. PERFORMANCE_SCHEMA
B. SYS
C. DATA_DICTIONARY
D. TABLE_STATISTICS

정답: C
해설: MySQL 8.0은 메타데이터 캐싱 및 성능 개선을 위해 새로운 내부 dictionary 테이블 구조를 도입함.
출제 이유: 메타데이터 처리 성능이 개선되었고, 이를 설명할 기회로 삼기 위함.

9. 다음 중 MySQL 8.0에서 공식 지원하지 않는 기능은?
A. 캐릭터 세트 utf8mb3
B. 히스토그램 통계
C. 공간 인덱스(SPATIAL)
D. 쿼리 힌트

정답: A
해설: utf8mb3는 더 이상 기본 캐릭터셋이 아니며 사용이 권장되지 않음. 대신 utf8mb4 사용해야 함.
출제 이유: utf8과 utf8mb4 차이를 명확히 알도록 유도함.

10. MySQL 8.0에서 복제 구조에 대한 변화로 올바른 설명은?
A. GTID 복제가 제거되었다
B. Multi-source replication이 비활성화되었다
C. binary log는 JSON으로 저장된다
D. 그룹 복제(Group Replication)가 공식 기능으로 도입되었다

정답: D
해설: MySQL 8.0부터 Group Replication을 기본 내장 기능으로 제공하며, InnoDB Cluster의 핵심 구성요소임.
출제 이유: 고가용성 구성을 고민하는 초기 사용자에게 Group Replication의 존재를 알려주기 위함.