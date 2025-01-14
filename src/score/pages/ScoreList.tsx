import { useState, useEffect } from 'react';
import axios from 'axios';
import ScoreContent from '../components/ScoreContent';
import ScoreSearchForm from '../components/ScoreSearchForm';

interface Score {
  total_points: string;
  scoring_date_time: string;
  // Ai
  ai_sensitivity_bonus: string | null;
  // DX-G
  bonus_point: string | null;
  music__artist__artist_name: string;
  music__contents_name: string;
}

// アーティスト名で絞り込みするメソッド
function handleFilterScoreListByArtist(allScoreList: Score[], artistName: string): Score[] {
  // JavaScriptのfilter()メソッドで絞り込み、絞り込んだ配列をline変数に格納
  const line = allScoreList.filter(
    (item) =>
      // アーティスト名が含まれている場合、true
      item.music__artist__artist_name.toLowerCase().indexOf(artistName.toLowerCase()) >= 0,
  );
  return line;
}

// 曲名で絞り込みするメソッド
function handleFilterSong(scoreList: Score[], songName: string): Score[] {
  // JavaScriptのfilter()メソッドで絞り込み、絞り込んだ配列をline変数に格納
  const line = scoreList.filter(
    (item) =>
      // アーティスト名が含まれている場合、true
      item.music__contents_name.toLowerCase().indexOf(songName.toLowerCase()) >= 0,
  );
  return line;
}

// 素点の昇順で並び替えるメソッドを定義
function handleSortPointByAscend(scoreList: Score[], totalPoint: string, bonus_point: string): Score[] {
  const line: Score[] = scoreList.sort((a: any, b: any) => {
    if (a[totalPoint] - a[bonus_point] < b[totalPoint] - b[bonus_point]) return -1;
    if (a[totalPoint] - a[bonus_point] > b[totalPoint] - b[bonus_point]) return 1;
    return 0;
  });
  return line;
}

// 素点の降順で並び替えるメソッドを定義
function handleSortPointByDescend(scoreList: Score[], totalPoint: string, bonus_point: string) {
  const line = scoreList.sort((a: any, b: any) => {
    if (a[totalPoint] - a[bonus_point] < b[totalPoint] - b[bonus_point]) return 1;
    if (a[totalPoint] - a[bonus_point] > b[totalPoint] - b[bonus_point]) return -1;
    return 0;
  });
  return line;
}

// 昇順で並び替えるメソッドを定義
function handleSortByAscend(scoreList: Score[], sortKeyName: string): Score[] {
  const line: Score[] = scoreList.sort((a: any, b: any) => {
    if (a[sortKeyName] < b[sortKeyName]) return -1;
    if (a[sortKeyName] > b[sortKeyName]) return 1;
    return 0;
  });
  return line;
}

// 降順で並び替えるメソッドを定義
function handleSortByDescend(scoreList: Score[], sortKeyName: string) {
  const line = scoreList.sort((a: any, b: any) => {
    if (a[sortKeyName] < b[sortKeyName]) return 1;
    if (a[sortKeyName] > b[sortKeyName]) return -1;
    return 0;
  });
  return line;
}

function handleDeleteDuplicateByKeyName(scoreList: Score[], keyName: string) {
  const result_list: Score[] = scoreList.reduce((a: Score[], v: Score) => {
    if (!a.some((e) => e[keyName as keyof typeof e] === v[keyName as keyof typeof v])) {
      a.push(v);
    }
    return a;
  }, []);

  return result_list;
}

const ScoreList = () => {
  const [connectedApi, setConnectedApi] = useState<Boolean>(false);
  const [loadedScoreList, setLoadedScoreList] = useState<Boolean>(false);
  const [filteredScoreList, setFilteredScoreList] = useState<Boolean>(false);
  const [allScoreList, setAllScoreList] = useState<Score[]>([]);
  const [scoreList, setScoreList] = useState<Score[]>([]);

  // ScoreSearchForm同様の項目
  const [denmoku, selectedDenmokuChange] = useState<string>(localStorage.getItem('denmoku') ?? 'dxg');
  const [artistName, selectedArtistNameChange] = useState<string>(localStorage.getItem('artistName') ?? '');
  const [contentsName, inputSongNameChange] = useState<string>(localStorage.getItem('contentsName') ?? '');
  const [bySong, selectedBySongChange] = useState<string>(localStorage.getItem('bySong') ?? '');
  const [orderBy, selectedOrderByChange] = useState<string>(localStorage.getItem('orderBy') ?? '');

  useEffect(() => {
    // 取得済の場合、実行しない
    if (loadedScoreList) return;

    if (process.env.REACT_APP_DJANGO_APP_API_URL === null) return;

    axios.get(process.env.REACT_APP_DJANGO_APP_API_URL + denmoku + '/').then((res) => {
      // APIからデータ取得
      console.log('api: データ取得');
      setConnectedApi(true);
      setAllScoreList(res.data);
    });
    setLoadedScoreList(true);
  }, [loadedScoreList, denmoku]);

  useEffect(() => {
    if (!loadedScoreList) return;

    console.log('front: データ更新');
    let scoreList: Score[] = handleFilterScoreListByArtist(allScoreList, artistName);
    if (contentsName !== '') {
      scoreList = handleFilterSong(scoreList, contentsName);
    }

    let bonusPointName = '';
    if (denmoku === 'ai') {
      bonusPointName = 'ai_sensitivity_bonus';
    } else if (denmoku === 'dxg') {
      bonusPointName = 'bonus_point';
    }

    if (bySong === 'max_point' && bonusPointName !== '') {
      // 降順で並び替え（素点）
      scoreList = handleSortPointByDescend(scoreList, 'total_points', bonusPointName);
    } else if (bySong === 'max_total_point') {
      // 降順で並び替え（総合点）
      scoreList = handleSortByDescend(scoreList, 'total_points');
    } else if (bySong === 'min_point' && bonusPointName !== '') {
      // 昇順で並び替え（素点）
      scoreList = handleSortPointByAscend(scoreList, 'total_points', bonusPointName);
    } else if (bySong === 'min_total_point') {
      // 昇順で並び替え（総合点）
      scoreList = handleSortByAscend(scoreList, 'total_points');
    }

    if (bySong !== '') {
      // 曲名の重複を削除
      scoreList = handleDeleteDuplicateByKeyName(scoreList, 'music__contents_name');
    }

    // 全く同じ日時データの重複削除
    scoreList = handleDeleteDuplicateByKeyName(scoreList, 'scoring_date_time');

    if (orderBy === 'date_time') {
      // 昇順で並び替え（点数）
      scoreList = handleSortByAscend(scoreList, 'scoring_date_time');
    } else if (orderBy === 'point') {
      // 昇順で並び替え（点数）
      scoreList = handleSortPointByAscend(scoreList, 'total_points', bonusPointName);
    } else if (orderBy === 'total_point') {
      // 昇順で並び替え（総合点）
      scoreList = handleSortByAscend(scoreList, 'total_points');
    } else if (orderBy === 'song__artist_name') {
      // 昇順で並び替え（総合点）
      scoreList = handleSortByAscend(scoreList, 'music__artist__artist_name');
    } else if (orderBy === 'song__contents_name') {
      // 昇順で並び替え（総合点）
      scoreList = handleSortByAscend(scoreList, 'music__contents_name');
    } else if (orderBy === '-date_time') {
      // 降順で並び替え（点数）
      scoreList = handleSortByDescend(scoreList, 'scoring_date_time');
    } else if (orderBy === '-point') {
      // 降順で並び替え（点数）
      scoreList = handleSortPointByDescend(scoreList, 'total_points', bonusPointName);
    } else if (orderBy === '-total_point') {
      // 降順で並び替え（総合点）
      scoreList = handleSortByDescend(scoreList, 'total_points');
    } else if (orderBy === '-song__artist_name') {
      // 降順で並び替え（総合点）
      scoreList = handleSortByDescend(scoreList, 'music__artist__artist_name');
    } else if (orderBy === '-song__contents_name') {
      // 降順で並び替え（総合点）
      scoreList = handleSortByDescend(scoreList, 'music__contents_name');
    }

    // console.log(scoreList)
    setScoreList(scoreList);
    // 検索処理完了
    setFilteredScoreList(true);
  }, [loadedScoreList, denmoku, allScoreList, artistName, contentsName, bySong, orderBy]);

  let message: string = '';
  if (process.env.REACT_APP_DJANGO_APP_API_URL === null) {
    message = 'API 環境変数に値を設定をしてください。';
  } else if (!connectedApi) {
    message = 'API に接続できませんでした。';
  } else if (!loadedScoreList) {
    message = 'API からデータ取得中です。';
  } else if (!filteredScoreList) {
    message = 'API から取得後、データを加工中です。';
  }

  return (
    <>
      <ScoreSearchForm
        selectedDenmokuChange={selectedDenmokuChange}
        setLoadedScoreList={setLoadedScoreList}
        selectedArtistNameChange={selectedArtistNameChange}
        inputSongNameChange={inputSongNameChange}
        selectedBySongChange={selectedBySongChange}
        selectedOrderByChange={selectedOrderByChange}
      />
      {connectedApi && loadedScoreList && filteredScoreList ? (
        <div id='result_search'>
          <h1 className='text-xl'>検索結果は {Object.keys(scoreList).length}件 でした～</h1>
          {scoreList.map((score: Score) => (
            <ScoreContent
              score={score}
              denmoku={denmoku}
              isSortedTotalPoint={orderBy === 'total_point' || orderBy === '-total_point'}
              key={String(score.scoring_date_time)}
            />
          ))}
        </div>
      ) : (
        <>
          <h1 className='text-5xl text-center font-semibold p-10'>Now Loading...</h1>
          <h1 className='text-5xl text-center font-semibold p-10'>{message}</h1>
        </>
      )}
    </>
  );
};

export default ScoreList;
