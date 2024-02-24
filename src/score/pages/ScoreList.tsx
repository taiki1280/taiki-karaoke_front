import { useState, useEffect } from 'react'
import axios from 'axios'
import ScoreContent from '../components/ScoreContent'
import ScoreSearchForm from '../components/ScoreSearchForm'

interface Score {
  totalPoints: string
  scoringDateTime: string
  // Ai
  aiSensitivityBonus: string | null
  // DX-G
  bonusPoint: string | null
  requestNo__artist__artistName: string
  requestNo__contentsName: string
}

// アーティスト名で絞り込みするメソッド
function handleFilterScoreListByArtist(allScoreList: Score[], artistName: string): Score[] {
  // JavaScriptのfilter()メソッドで絞り込み、絞り込んだ配列をline変数に格納
  const line = allScoreList.filter(
    (item) =>
      // アーティスト名が含まれている場合、true
      item.requestNo__artist__artistName.toLowerCase().indexOf(artistName.toLowerCase()) >= 0,
  )
  return line
}

// 曲名で絞り込みするメソッド
function handleFilterSong(scoreList: Score[], songName: string): Score[] {
  // JavaScriptのfilter()メソッドで絞り込み、絞り込んだ配列をline変数に格納
  const line = scoreList.filter(
    (item) =>
      // アーティスト名が含まれている場合、true
      item.requestNo__contentsName.toLowerCase().indexOf(songName.toLowerCase()) >= 0,
  )
  return line
}

// 素点の昇順で並び替えるメソッドを定義
function handleSortPointByAscend(scoreList: Score[], totalPoint: string, bonus_point: string): Score[] {
  const line: Score[] = scoreList.sort((a: any, b: any) => {
    if (a[totalPoint] - a[bonus_point] < b[totalPoint] - b[bonus_point]) return -1
    if (a[totalPoint] - a[bonus_point] > b[totalPoint] - b[bonus_point]) return 1
    return 0
  })
  return line
}

// 素点の降順で並び替えるメソッドを定義
function handleSortPointByDescend(scoreList: Score[], totalPoint: string, bonus_point: string) {
  const line = scoreList.sort((a: any, b: any) => {
    if (a[totalPoint] - a[bonus_point] < b[totalPoint] - b[bonus_point]) return 1
    if (a[totalPoint] - a[bonus_point] > b[totalPoint] - b[bonus_point]) return -1
    return 0
  })
  return line
}

// 昇順で並び替えるメソッドを定義
function handleSortByAscend(scoreList: Score[], sortKeyName: string): Score[] {
  const line: Score[] = scoreList.sort((a: any, b: any) => {
    if (a[sortKeyName] < b[sortKeyName]) return -1
    if (a[sortKeyName] > b[sortKeyName]) return 1
    return 0
  })
  return line
}

// 降順で並び替えるメソッドを定義
function handleSortByDescend(scoreList: Score[], sortKeyName: string) {
  const line = scoreList.sort((a: any, b: any) => {
    if (a[sortKeyName] < b[sortKeyName]) return 1
    if (a[sortKeyName] > b[sortKeyName]) return -1
    return 0
  })
  return line
}

function handleDeleteDuplicateByKeyName(scoreList: Score[], keyName: string) {
  const result_list: Score[] = scoreList.reduce((a: Score[], v: Score) => {
    if (!a.some((e) => e[keyName as keyof typeof e] === v[keyName as keyof typeof v])) {
      a.push(v)
    }
    return a
  }, [])

  return result_list
}

const ScoreList = () => {
  const [connectedApi, setConnectedApi] = useState<Boolean>(false)
  const [loadedScoreList, setLoadedScoreList] = useState<Boolean>(false)
  const [filteredScoreList, setFilteredScoreList] = useState<Boolean>(false)
  const [allScoreList, setAllScoreList] = useState<Score[]>([])
  const [scoreList, setScoreList] = useState<Score[]>([])

  // ScoreSearchForm同様の項目
  const [denmoku, selectedDenmokuChange] = useState<string>('ai')
  const [artistName, selectedArtistNameChange] = useState<string>('ヨルシカ')
  const [contentsName, inputSongNameChange] = useState<string>('')
  const [bySong, selectedBySongChange] = useState<string>('max_point')
  const [orderBy, selectedOrderByChange] = useState<string>('point')

  useEffect(() => {
    // 取得済の場合、実行しない
    if (loadedScoreList) return

    const DJANGO__URL = process.env.REACT_APP_DJANGO_APP_API_URL ?? null
    if (DJANGO__URL === null) return

    axios.get(DJANGO__URL + denmoku + '/').then((res) => {
      // APIからデータ取得
      console.log('API取得データ')
      setConnectedApi(true)
      setAllScoreList(res.data)
    })
    setLoadedScoreList(true)
  }, [loadedScoreList, denmoku])

  useEffect(() => {
    if (!loadedScoreList) return

    console.log('スコアデータ更新')
    let scoreList: Score[] = handleFilterScoreListByArtist(allScoreList, artistName)
    if (contentsName !== '') {
      scoreList = handleFilterSong(scoreList, contentsName)
    }

    let bonusPointName = ''
    if (denmoku === 'ai') {
      bonusPointName = 'aiSensitivityBonus'
    } else if (denmoku === 'dxg') {
      bonusPointName = 'bonusPoint'
    }

    if (bySong === 'max_point' && bonusPointName !== '') {
      // 降順で並び替え（素点）
      scoreList = handleSortPointByDescend(scoreList, 'totalPoints', bonusPointName)
    } else if (bySong === 'max_total_point') {
      // 降順で並び替え（総合点）
      scoreList = handleSortByDescend(scoreList, 'totalPoints')
    } else if (bySong === 'min_point' && bonusPointName !== '') {
      // 昇順で並び替え（素点）
      scoreList = handleSortPointByAscend(scoreList, 'totalPoints', bonusPointName)
    } else if (bySong === 'min_total_point') {
      // 昇順で並び替え（総合点）
      scoreList = handleSortByAscend(scoreList, 'totalPoints')
    }

    if (bySong !== '') {
      // 曲名の重複を削除
      scoreList = handleDeleteDuplicateByKeyName(scoreList, 'requestNo__contentsName')
    }

    // 全く同じ日時データの重複削除
    scoreList = handleDeleteDuplicateByKeyName(scoreList, 'scoringDateTime')

    if (orderBy === 'date_time') {
      // 昇順で並び替え（点数）
      scoreList = handleSortByAscend(scoreList, 'scoringDateTime')
    } else if (orderBy === 'point') {
      // 昇順で並び替え（点数）
      scoreList = handleSortPointByAscend(scoreList, 'totalPoints', bonusPointName)
    } else if (orderBy === 'total_point') {
      // 昇順で並び替え（総合点）
      scoreList = handleSortByAscend(scoreList, 'totalPoints')
    } else if (orderBy === 'song__artist_name') {
      // 昇順で並び替え（総合点）
      scoreList = handleSortByAscend(scoreList, 'requestNo__artist__artistName')
    } else if (orderBy === 'song__contents_name') {
      // 昇順で並び替え（総合点）
      scoreList = handleSortByAscend(scoreList, 'requestNo__contentsName')
    } else if (orderBy === '-date_time') {
      // 降順で並び替え（点数）
      scoreList = handleSortByDescend(scoreList, 'scoringDateTime')
    } else if (orderBy === '-point') {
      // 降順で並び替え（点数）
      scoreList = handleSortPointByDescend(scoreList, 'totalPoints', bonusPointName)
    } else if (orderBy === '-total_point') {
      // 降順で並び替え（総合点）
      scoreList = handleSortByDescend(scoreList, 'totalPoints')
    } else if (orderBy === '-song__artist_name') {
      // 降順で並び替え（総合点）
      scoreList = handleSortByDescend(scoreList, 'requestNo__artist__artistName')
    } else if (orderBy === '-song__contents_name') {
      // 降順で並び替え（総合点）
      scoreList = handleSortByDescend(scoreList, 'requestNo__contentsName')
    }

    // console.log(scoreList)
    setScoreList(scoreList)
    // 検索処理完了
    setFilteredScoreList(true)
  }, [loadedScoreList, denmoku, allScoreList, artistName, contentsName, bySong, orderBy])

  let message: string = ''
  if (!connectedApi) {
    message = 'API 環境変数に値を設定をしてください。'
  } else if (!loadedScoreList) {
    message = 'API からデータ取得中です。'
  } else if (!filteredScoreList) {
    message = 'API から取得後、データを加工中です。'
  }

  return (
    <>
      <ScoreSearchForm
        selectedDenmokuChange={selectedDenmokuChange}
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
              key={String(score.scoringDateTime)}
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
  )
}

export default ScoreList
