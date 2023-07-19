원티드 인턴십 프리온 보딩 4주자 과제

## ABOUT

- [한국임상정보](https://clinicaltrialskorea.com/) 검색영역 클론하기
- 검색창 구현
- 검색어 추천 기능 구현
- 캐싱 기능 구현

## 기술스택

![React](https://img.shields.io/badge/Create--React--App-5.0.1-20232A?logo=react)
![typescript](https://img.shields.io/badge/typescript-4.9.5-007ACC?logo=typescript)
![styled-components](https://img.shields.io/badge/styled--components%2Fcss-1.12.0-28A745?logo=styled-components)
![axios](https://img.shields.io/badge/axios-1.4.0-%23671DDF?logo=axios&logoColor=%23671DDF)

## 실행방법

### 1. api 링크 : [assignment-api](https://github.com/walking-sunset/assignment-api)

```bash
1. git clone
2. npm install
3. npm start
```

### 2. 해당 깃 주소 클론 후

```bash
1. npm install
2. npm start
```

## API 호출별로 로컬 캐싱 구현

- 웹 스토리지 중 localStorage 사용하여 최근 검색어 저장 및 불러오기
- 클릭한 아이템 대상으로 `cacheing : [{sickNm : '', sickCd : ''} ,...]` 형태로 저장
- 초기 렌더링시 스토리지에 검색어가 있다면 불러와서 state 시켜줌.

```typescript
// SearchBanner.tsx 부모 컴포넌트

const cacheing = (data: Sick) => {
  setCacheingData(prev => [...prev, data]);
  setKeyIndex(-1);
};

...

useEffect(() => {
  if (localStorage.getItem('cacheing'))
    setCacheingData(JSON.parse(localStorage.getItem('cacheing') as string));

  return () => {
    clearTimeout(timeIndex);
  };
}, []);

...

useEffect(() => {
  localStorage.setItem('cacheing', JSON.stringify(cacheingData));
}, [cacheingData]);
```

```typescript
// components/SearchItem.tsx 자식 컴포넌트

type propsType = {
  cacheing: (data: Sick) => void;
  sick: Sick;
  focusIndex: boolean;
};

const SearchItem = ({ cacheing, sick, focusIndex }: propsType) => {
  return (
    <ItemContainer
      $focusIndex={focusIndex}
      onClick={() => {
        cacheing(sick);
      }}>
      {sick.sickNm}
    </ItemContainer>
  );
};
```

## 입력마다 API 호출하지 않도록 API 호출 횟수 줄이는 전략 수립 및 실행

- input 검색창이 onChange할 때마다 요청하지 않고, setTimeout을 통해 0.5초 딜레이하여 키워드 검색 요청

```typescript
// pages/SearchBanner.tsx
const [timeIndex, setTimeIndex] = useState<any>(0);

const fetchData = (query: String) => {
  const timer = setTimeout(() => {
    getRecommendSickSearch(dispatch, query);
  }, 500);
  setTimeIndex(timer);
};

useEffect(() => {
  if (localStorage.getItem('cacheing'))
    setCacheingData(JSON.parse(localStorage.getItem('cacheing') as string));

  return () => {
    clearTimeout(timeIndex);
  };
}, []);
```

## 키보드만으로 추천 검색어들로 이동 가능하도록 구현

- onKeyDown 이벤트를 통해 아래, 위, 엔터 키 각각에 대하여 동작 구현
- keyIndex 초기 상태 -1로 설정하여 다음 키 동작 부터 적용
- 한글 검색시 2번 렌더링되는 이슈 `event.nativeEvent.isComposing` 분기처리하여 해결
  - `isComposing`이란 글자 조합이 완료된 상태를 구분하는 값으로, 한글의 경우 자음과 모음의 조합으로 글자가 만들어지므로 조합상태를 구분하기 위해 사용

```typescript
const [keyIndex, setKeyIndex] = useState(-1);

const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (!e.nativeEvent.isComposing) {
    if (e.key === 'ArrowDown') {
      (searchData?.length as number) > 0 &&
        setKeyIndex(prev => (prev + 1) % ((searchData?.length as number) - 1));
    } else if (e.key === 'ArrowUp') {
      (searchData?.length as number) > 0 &&
        setKeyIndex(prev => (prev - 1) % ((searchData?.length as number) - 1));
    } else if (e.key === 'Enter') {
      (inputRef.current as HTMLInputElement).value = (searchData as Sick[])[keyIndex].sickNm;
    }
  }
};
```
