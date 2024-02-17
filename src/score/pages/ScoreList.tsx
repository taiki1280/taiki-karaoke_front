import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ScoreContent from '../components/ScoreContent'
import ScoreSearchForm from '../components/ScoreSearchForm'

interface Score {
  totalPoints: string
  scoringDateTime: string
  aiSensitivityBonus: string
  requestNo__artist__artistName: string
  requestNo__contentsName: string
}

function handleFilterVal(all_score_list: Score[], artist_name: string): Score[] {
  // JavaScriptのfilter()メソッドで絞り込み、絞り込んだ配列をline変数に格納
  const line = all_score_list.filter((item) => (
    // idまたはnameにキーワードが含まれていればtrueを返す
    item['requestNo__artist__artistName'] == artist_name
  ));
  return line
}

// 昇順で並び替えるメソッドを定義
function handleSortByAscend(score_list: Score[], sort_key_name: string): Score[] {
  const line: Score[] = score_list.sort((a: any, b: any) => {
    if (a[sort_key_name] < b[sort_key_name]) return -1;
    if (a[sort_key_name] > b[sort_key_name]) return 1;
    return 0;
  });
  return line;
}

// 昇順で並び替えるメソッドを定義
function handleSortByDescend(score_list: Score[], sort_key_name: string) {
  const line = score_list.sort((a: any, b: any) => {
    if (a[sort_key_name] < b[sort_key_name]) return 1;
    if (a[sort_key_name] > b[sort_key_name]) return -1;
    return 0;
  });
  return line;
}

const ScoreList = () => {

  const [loaded_score_list, setLoadedScoreList] = useState<Boolean>(false)
  const [all_score_list, setAllScoreList] = useState<Score[]>([])
  const [score_list, setScoreList] = useState<Score[]>([])

  useEffect(() => {
    if (process.env.REACT_APP_DJANGO_APP_API_URL !== undefined)
      axios.get(process.env.REACT_APP_DJANGO_APP_API_URL)
        .then(res => {
          let all_score_list: [] = res.data
          setAllScoreList(all_score_list)

          let score_list: Score[] = handleFilterVal(all_score_list, 'ヨルシカ')
          // 降順で並び替え（点数）
          score_list = handleSortByDescend(score_list, 'totalPoints')

          // 重複削除（最高点以外削除）
          let duplicate_song_list: String[] = []
          score_list = score_list.map<Score>(
            (score: any) => {
              if (duplicate_song_list.includes(score['requestNo__contentsName']))
                return;
              if (score['requestNo__contentsName'] != undefined) {
                duplicate_song_list.push(score['requestNo__contentsName'])
                return score;
              }
            }
          ).filter(score => score)
          // filterでundefinedを削除

          // 昇順で並び替え（点数）
          score_list = handleSortByAscend(score_list, 'totalPoints')

          console.log(score_list)
          setScoreList(score_list)
          setLoadedScoreList(true)
        })
    else
      console.log('環境変数にDjangoアプリのURLを設定してください')
  }, [])

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

  return (
    <>
      {
        loaded_score_list ?
          <>
            <ScoreSearchForm />
            <h1 className='text-xl'>検索結果は {Object.keys(score_list).length}件 でした～</h1>
            {/* {score_list.map(() => score)} */}
            {score_list.map((score: Score) => <ScoreContent score={score} key={String(score.scoringDateTime)} />)}
          </>
          :
          <div>
            <h1 className='text-5xl text-center font-semibold p-10'>Now Loading...</h1>
            <h1 className='text-5xl text-center font-semibold p-10'>データ取得中だよ～</h1>
          </div>
      }
    </>
  )
}

export default ScoreList