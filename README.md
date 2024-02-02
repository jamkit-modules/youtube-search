# youtube-search

유튜브를 검색하여 검색 목록을 반환하는 모듈

## Examples

```sbml
=object sbml: id=sbml.youtube, style=sbml_youtube
```

```sbss
#sbml_youtube {
  width: 1pw;
  height: 1ph;
  position: absolute;
  gravity: center;
  hidden: yes;
}
```

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

## API References

### `initialize(sbml_id)`

- **Parameters**:
  - `sbml_id` (string) - 유튜브 검색에 사용되는 웹뷰를 호스팅할 sbml 오브젝트의 ID
 
- **Returns**: `module` - 초기화한 모듈 자체의 인스턴스 

### `search(keyword, location)`

- **Parameters**:
  - `keyword` (string) - 검색 키워드
  - `location` (number, optional, default=0) - 유튜브 검색 목록에서 가져올 첫번째 인덱스
 
- **Returns**: `Promise<array>` - 검색 결과가 담긴 배열 

