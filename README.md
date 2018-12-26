# Paper_Repository

1. Pages

Github 페이지를 담는 폴더. 
각 페이지별로 필요한 html, css, javascript파일이 담긴다.

2. Papers

각 논문에 대한 정보(title, author, journal,..)가 있는 bib 파일과 레포지토리에 업로드할 때의 메타데이터(title, upload date, upload user,..) 파일이 담긴다.

3. Tags

(태그의 계층수를 3개로 가정하여 설계)

- tag-tag.csv 

  tag1,tag2,tag3
  Paper.bib,paper.html

  (1)태그의 전체목록과 (2)태그와 태그의 관계를 보여주는 동시에 (3)태그한 논문까지 보여주는 파일이다.  헤더의 tag1,tag2,tag3에서 tag1은 가장 상위계층의 태그이고 tag3은 가장 하위계층의 태그이다.
  Tag3에 연관되는 논문이 연결되는 구조.

- paper-tags.csv

  paper_title1,paper_data1,tag1,tag2,tag3
  한 논문이 어떤 태그와 연관되는지 기록.

