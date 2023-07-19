import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { AiOutlineSearch } from 'react-icons/ai';
import SearchItem from '../components/SearchItem';
import { Sick } from '../types/sickType';
import { useSickApi, useSickDispatch, useSickState } from '../api/SickContext';
import RecentSearchItem from '../components/RecentSearchItem';

function SearchBanner() {
  const [resultOpen, setResultOpen] = useState(false);
  const [timeIndex, setTimeIndex] = useState<any>(0);
  const [keyIndex, setKeyIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);

  const [searchData, setSearchData] = useState<Sick[] | null>([]);
  const [cacheingData, setCacheingData] = useState<Array<Sick>>([]);

  const { getRecommendSickSearch } = useSickApi();
  const dispatch = useSickDispatch();
  const { sickList } = useSickState();

  const cacheing = (data: Sick) => {
    setCacheingData(prev => [...prev, data]);
    setKeyIndex(-2);
  };

  const fetchData = (query: String) => {
    const timer = setTimeout(() => {
      getRecommendSickSearch(dispatch, query);
    }, 500);
    setTimeIndex(timer);
  };

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

  useEffect(() => {
    setSearchData(sickList.data);
  }, [sickList]);

  useEffect(() => {
    if (localStorage.getItem('cacheing'))
      setCacheingData(JSON.parse(localStorage.getItem('cacheing') as string));

    return () => {
      clearTimeout(timeIndex);
    };
  }, []);

  useEffect(() => {
    const handleClickOutSide = (e: MouseEvent) => {
      if (
        resultRef.current &&
        !resultRef.current.contains(e.target as Node) &&
        (e.target as Node).nodeName !== 'INPUT'
      ) {
        setResultOpen(false);
      }
    };

    if (resultOpen) document.addEventListener('click', handleClickOutSide);
    return () => {
      document.removeEventListener('click', handleClickOutSide);
    };
  }, [resultRef, resultOpen]);

  useEffect(() => {
    localStorage.setItem('cacheing', JSON.stringify(cacheingData));
  }, [cacheingData]);

  return (
    <>
      <Container>
        <BannerDiv>
          <Title>
            국내 모든 임상시험 검색하고 <br />
            온라인으로 참여하기
          </Title>
          <SearchBar>
            <InputDiv>
              <Input
                ref={inputRef}
                placeholder='질환명을 입력해 주세요'
                onClick={() => {
                  setResultOpen(true);
                }}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  fetchData(e.target.value);
                }}
                onKeyDown={handleKeyDown}></Input>
            </InputDiv>
            <SearchBtn>
              <AiOutlineSearch />
            </SearchBtn>
          </SearchBar>
          {resultOpen && (
            <SearchResult ref={resultRef}>
              <RecentSearch>
                <SearchTitle>최근 검색어</SearchTitle>
                <>
                  {cacheingData?.map((s: Sick) => {
                    return <RecentSearchItem sick={s} key={s.sickCd} />;
                  })}
                </>
              </RecentSearch>
              <hr />
              <RecommentSearch>
                <SearchTitle>추천 검색어로 검색해보세요</SearchTitle>
                <>
                  {searchData?.length === 0 && <NoResult>검색어 없음</NoResult>}
                  {searchData?.map((s: Sick, i) => {
                    return (
                      <SearchItem
                        cacheing={cacheing}
                        sick={s}
                        key={s.sickCd}
                        focusIndex={keyIndex === i}
                      />
                    );
                  })}
                </>
              </RecommentSearch>
            </SearchResult>
          )}
        </BannerDiv>
      </Container>
    </>
  );
}

const Container = styled.div`
  background-color: #bfe4ff;
  height: 550px;
  width: 100%;
`;

const BannerDiv = styled.div`
  padding: 80px 0 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 2.125rem;
  font-weight: 700;
  letter-spacing: -0.018em;
  line-height: 1.6;
`;

const SearchBar = styled.div`
  max-width: 490px;

  border-radius: 42px;
  border: 2px solid;
  border-color: #ffffff;
  background-color: #ffffff;
  flex-direction: row;
  align-items: center;
  font-size: 1rem;
  font-weight: 400;
  letter-spacing: -0.018em;
  line-height: 1.6;

  display: flex;
  width: 100%;
  position: relative;
  padding-right: 8px;
`;

const InputDiv = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;

  font-size: 1.125rem;
  font-weight: 700;
  letter-spacing: -0.018em;
  line-height: 1.6;

  padding: 20px 10px 20px 24px;
  font-weight: 400;
`;

const Input = styled.input`
  display: flex;
  width: 100%;
  flex-direction: column;

  width: 100%;
  border: 0;
  background-color: transparent;
  min-width: 0;

  flex: 1;
  &:focus {
    outline: none;
  }

  line-height: 1.6;
`;

const SearchBtn = styled.button`
  border-radius: 100%;
  width: 48px;
  height: 48px;
  font-weight: 500;
  border: 0;
  cursor: pointer;
  background-color: #007be9;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const SearchResult = styled.div`
  margin-top: 10px;
  background-color: #fff;
  min-height: 260px;
  max-width: 490px;
  width: 100%;
  height: 300px;
  overflow-y: auto;

  border-radius: 42px;

  z-index: 2;
  box-shadow:
    0 10px 15px -3px rgb(0 0 0 / 0.1),
    0 4px 6px -4px rgb(0 0 0 / 0.1);

  padding: 20px;
`;

const RecentSearch = styled.div``;

const SearchTitle = styled.p`
  color: #666;
  text-align: left;
  padding: 10px 0px;
`;

const RecommentSearch = styled.div``;

const NoResult = styled.p`
  text-align: left;
  padding: 10px 0px;
`;
export default SearchBanner;
