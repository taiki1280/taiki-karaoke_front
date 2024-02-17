import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ScoreContent from '../components/ScoreContent'
import ScoreSearchForm from '../components/ScoreSearchForm'

interface Score {
  totalPoints: string
  scoringDateTime: string
  // Ai
  aiSensitivityBonus: String | null
  // DX-G
  bonusPoint: String | null
  requestNo__artist__artistName: string
  requestNo__contentsName: string
}

interface SearchValues {
  denmoku: string
  artist_name: string
  contents_name: string
  by_song: string
  order_by: string
}

// アーティスト名で絞り込みするメソッド
function handleFilterArtist(all_score_list: Score[], artist_name: string): Score[] {
  // JavaScriptのfilter()メソッドで絞り込み、絞り込んだ配列をline変数に格納
  const line = all_score_list.filter(
    (item) =>
      // アーティスト名が含まれている場合、true
      item.requestNo__artist__artistName.toLowerCase().indexOf(artist_name.toLowerCase()) >= 0
  )
  return line
}

// 曲名で絞り込みするメソッド
function handleFilterSong(score_list: Score[], song_name: string): Score[] {
  // JavaScriptのfilter()メソッドで絞り込み、絞り込んだ配列をline変数に格納
  const line = score_list.filter(
    (item) =>
      // アーティスト名が含まれている場合、true
      item.requestNo__contentsName.toLowerCase().indexOf(song_name.toLowerCase()) >= 0
  )
  return line
}

// 素点の昇順で並び替えるメソッドを定義
function handleSortPointByAscend(score_list: Score[], total_point: string, bonus_point: string): Score[] {
  const line: Score[] = score_list.sort((a: any, b: any) => {
    if (a[total_point] - a[bonus_point] < b[total_point] - b[bonus_point]) return -1
    if (a[total_point] - a[bonus_point] > b[total_point] - b[bonus_point]) return 1
    return 0
  })
  return line
}

// 素点の降順で並び替えるメソッドを定義
function handleSortPointByDescend(score_list: Score[], total_point: string, bonus_point: string) {
  const line = score_list.sort((a: any, b: any) => {
    if (a[total_point] - a[bonus_point] < b[total_point] - b[bonus_point]) return 1
    if (a[total_point] - a[bonus_point] > b[total_point] - b[bonus_point]) return -1
    return 0
  })
  return line
}

// 昇順で並び替えるメソッドを定義
function handleSortByAscend(score_list: Score[], sort_key_name: string): Score[] {
  const line: Score[] = score_list.sort((a: any, b: any) => {
    if (a[sort_key_name] < b[sort_key_name]) return -1
    if (a[sort_key_name] > b[sort_key_name]) return 1
    return 0
  })
  return line
}

// 降順で並び替えるメソッドを定義
function handleSortByDescend(score_list: Score[], sort_key_name: string) {
  const line = score_list.sort((a: any, b: any) => {
    if (a[sort_key_name] < b[sort_key_name]) return 1
    if (a[sort_key_name] > b[sort_key_name]) return -1
    return 0
  })
  return line
}

function handleDeleteDuplicateByContentsName(score_list: Score[]) {
  const result_list: Score[] = score_list.reduce((a: Score[], v: Score) => {
    if (!a.some((e) => e['requestNo__contentsName'] === v['requestNo__contentsName'])) {
      a.push(v)
    }
    return a
  }, [])

  return result_list
}

const ScoreList = () => {
  const [loaded_score_list, setLoadedScoreList] = useState<Boolean>(false)
  const [filtered_score_list, setFilteredScoreList] = useState<Boolean>(false)
  const [all_score_list, setAllScoreList] = useState<Score[]>([])
  const [score_list, setScoreList] = useState<Score[]>([])

  // ScoreSearchForm同様の項目
  const [denmoku, selectedDenmokuChange] = useState<string>('ai')
  const [artist_name, selectedArtistNameChange] = useState<string>('ヨルシカ')
  const [contents_name, inputSongNameChange] = useState<string>('')
  const [by_song, selectedBySongChange] = useState<string>('max_point')
  const [order_by, selectedOrderByChange] = useState<string>('point')

  useEffect(() => {
    const django_url = process.env.REACT_APP_DJANGO_APP_API_URL ?? null
    if (django_url === null) console.log('環境変数にDjangoアプリのURLを設定してください')

    axios.get(django_url + denmoku + '/').then((res) => {
      // APIからデータ取得
      console.log('API取得データ')
      setAllScoreList(res.data)
    })
    setLoadedScoreList(true)
  }, [denmoku])

  useEffect(() => {
    if (!loaded_score_list) return

    console.log('frontで検索データ更新')
    console.log('by_song')
    console.log(by_song)

    let score_list: Score[] = handleFilterArtist(all_score_list, artist_name)
    if (contents_name !== '') {
      score_list = handleFilterSong(score_list, contents_name)
    }

    let bonus_point_name = ''
    if (denmoku === 'ai') {
      bonus_point_name = 'aiSensitivityBonus'
    } else if (denmoku === 'dxg') {
      bonus_point_name = 'bonusPoint'
    }

    if (by_song === 'max_point' && bonus_point_name !== '') {
      // 降順で並び替え（素点）
      score_list = handleSortPointByDescend(score_list, 'totalPoints', bonus_point_name)
    } else if (by_song === 'max_total_point') {
      // 降順で並び替え（総合点）
      score_list = handleSortByDescend(score_list, 'totalPoints')
    } else if (by_song === 'min_point' && bonus_point_name !== '') {
      // 昇順で並び替え（素点）
      score_list = handleSortPointByAscend(score_list, 'totalPoints', bonus_point_name)
    } else if (by_song === 'min_point') {
      // 昇順で並び替え（素点）
      score_list = handleSortByAscend(score_list, 'totalPoints')
    }

    if (by_song !== '') {
      // 曲名の重複を削除
      score_list = handleDeleteDuplicateByContentsName(score_list)
    }

    if (order_by === 'date_time') {
      // 昇順で並び替え（点数）
      score_list = handleSortByAscend(score_list, 'scoringDateTime')
    } else if (order_by === 'point') {
      // 昇順で並び替え（点数）
      score_list = handleSortPointByAscend(score_list, 'totalPoints', bonus_point_name)
    } else if (order_by === 'total_point') {
      // 昇順で並び替え（総合点）
      score_list = handleSortByAscend(score_list, 'totalPoints')
    } else if (order_by === 'song__artist_name') {
      // 昇順で並び替え（総合点）
      score_list = handleSortByAscend(score_list, 'requestNo__artist__artistName')
    } else if (order_by === 'song__contents_name') {
      // 昇順で並び替え（総合点）
      score_list = handleSortByAscend(score_list, 'requestNo__contentsName')
    } else if (order_by === '-date_time') {
      // 降順で並び替え（点数）
      score_list = handleSortByDescend(score_list, 'scoringDateTime')
    } else if (order_by === '-point') {
      // 降順で並び替え（点数）
      score_list = handleSortPointByDescend(score_list, 'totalPoints', bonus_point_name)
    } else if (order_by === '-total_point') {
      // 降順で並び替え（総合点）
      score_list = handleSortByDescend(score_list, 'totalPoints')
    } else if (order_by === '-song__artist_name') {
      // 降順で並び替え（総合点）
      score_list = handleSortByDescend(score_list, 'requestNo__artist__artistName')
    } else if (order_by === '-song__contents_name') {
      // 降順で並び替え（総合点）
      score_list = handleSortByDescend(score_list, 'requestNo__contentsName')
    }

    // console.log(score_list)
    setScoreList(score_list)
    // 検索処理完了
    setFilteredScoreList(true)
  }, [denmoku, all_score_list, artist_name, contents_name, by_song, order_by, loaded_score_list])

  // let score: Score = {
  //   date_time: '2022/11/05 20:00:00',
  //   point: 10,
  //   total_point: 15,
  //   id: 1,
  //   song: {
  //     d_artist_name: 'dummy_artist_name',
  //     d_contents_name: 'dummy_contents_name'
  //   }
  // }

  // var score_list: Score[] = []

  // for (let i = 1; i <= Math.floor(Math.random() * 10000); i++) {
  //   let copy_score = Object.assign({}, score)
  //   let copy_song = Object.assign({}, score.song)
  //   copy_song.d_artist_name += String(Math.floor(Math.random() * 100))
  //   copy_song.d_contents_name += String(Math.floor(Math.random() * 100))
  //   copy_score.song = copy_song
  //   copy_score.id = i
  //   copy_score.point = Math.random() * 100
  //   copy_score.total_point = Math.random() * 100
  //   score_list.push(copy_score)
  // }
  let message = ''
  if (!loaded_score_list) message = '取得'
  else if (!filtered_score_list) message = '調整'

  return (
    <>
      {loaded_score_list && filtered_score_list ? (
        <>
          <ScoreSearchForm
            selectedDenmokuChange={selectedDenmokuChange}
            selectedArtistNameChange={selectedArtistNameChange}
            inputSongNameChange={inputSongNameChange}
            selectedBySongChange={selectedBySongChange}
            selectedOrderByChange={selectedOrderByChange}
          />
          <h1 className='text-xl'>検索結果は {Object.keys(score_list).length}件 でした～</h1>
          {/* {score_list.map(() => score)} */}
          {score_list.map((score: Score) => (
            <ScoreContent
              score={score}
              denmoku={denmoku}
              isSortedTotalPoint={order_by === 'total_point' || order_by === '-total_point'}
              key={String(score.scoringDateTime)}
            />
          ))}
        </>
      ) : (
        <div>
          <h1 className='text-5xl text-center font-semibold p-10'>Now Loading...</h1>
          <h1 className='text-5xl text-center font-semibold p-10'>{message}中だよ～</h1>
        </div>
      )}
    </>
  )
}

export default ScoreList
