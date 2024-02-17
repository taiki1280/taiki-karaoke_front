import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ScoreContent from '../components/ScoreContent'
import ScoreSearchForm from '../components/ScoreSearchForm'

const ScoreList = () => {

  const [loaded_score_list, setLoadedScoreList] = useState(false)
  const [score_list, setScoreList] = useState([])

  useEffect(() => {
    if (process.env.REACT_APP_DJANGO_APP_API_URL !== undefined)
      axios.get(process.env.REACT_APP_DJANGO_APP_API_URL)
        .then(res => {
          setScoreList(res.data)
          setLoadedScoreList(true)
          console.log(res.data)
        })
    else
      console.log('環境変数にDjangoアプリのURLを設定してください')
  }, [])

  type Score = {
    totalPoints: String
    scoringDateTime: String
    aiSensitivityBonus: String
    requestNo__artist__artistName: String
    requestNo__contentsName: String
  }

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