# youtube-search

유튜브를 검색하여 검색 목록을 반환하는 모듈

## Examples

#### sbml
```sbml
=object sbml: id=sbml.youtube, style=sbml_youtube
```

#### sbss
```sbss
#sbml_youtube {
  width: 1pw;
  height: 1ph;
  position: absolute;
  gravity: center;
  hidden: yes;
}
```

#### js
```js
const youtube = require("youtube-search").initialize("sbml.youtube");

youtube.search("Blackpink MV", 0)
  .then((result) => {
    ...
  })
  .catch((error) => {
    ...
  });
```

## Prerequisite

- [webjs-helper](https://github.com/jamkit-modules/webjs-helper) 
- [webjs-feed](https://github.com/jamkit-modules/webjs-feed) 

## API References

#### `initialize(sbml_id)`

- **Parameters**:
  - `sbml_id` (string) - 유튜브 검색에 사용되는 웹뷰를 호스팅할 sbml 오브젝트의 ID

- **Returns**: `module` - 초기화한 모듈 자체의 인스턴스 

#### `search(keyword, location)`

- **Parameters**:
  - `keyword` (string) - 검색 키워드
  - `location` (number, optional, default=0) - 유튜브 검색 목록에서 가져올 첫번째 인덱스
 
- **Returns**: `Promise<Array<VideoInfo>>` - 각 비디오의 정보를 담고 있는 `VideoInfo` 객체의 배열을 전달하는 `Promise`

- **VideoInfo**:
  - `type` (string) - 비디오 타입. `video` 혹은 `shorts`
  - `title` (string) - 비디오의 제목
  - `video-id` (string) - 유튜브 비디오 ID
  - `view-count` (string) - 비디오 조회수. `조회수 1.3천회`와 같이 유튜브 검색 화면에 노출되는 문자열
  - `published-at` (string) - 비디오 업로드 날짜. `1개월 전`와 같이 유튜브 검색 화면에 노출되는 문자열
