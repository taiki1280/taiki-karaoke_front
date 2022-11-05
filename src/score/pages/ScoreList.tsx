import ScoreContent from '../components/ScoreContent'
import ScoreSearchForm from '../components/ScoreSearchForm'

const ScoreList = () => {

  let loaded = true

  type Score = {
    date_time: String,
    point: Number,
    total_point: Number,
    id: Number,
    song: {
      d_artist_name: String
      d_contents_name: String
    }
  }

  let score: Score = {
    date_time: '2022/11/05 20:00:00',
    point: 10,
    total_point: 15,
    id: 1,
    song: {
      d_artist_name: 'dummy_artist_name',
      d_contents_name: 'dummy_contents_name'
    }
  }

  var score_list: Score[] = []

  for (let i = 1; i <= Math.floor(Math.random() * 10000); i++) {
    let copy_score = Object.assign({}, score)
    let copy_song = Object.assign({}, score.song)
    copy_song.d_artist_name += String(Math.floor(Math.random() * 100))
    copy_song.d_contents_name += String(Math.floor(Math.random() * 100))
    copy_score.song = copy_song
    copy_score.id = i
    copy_score.point = Math.random() * 100
    copy_score.total_point = Math.random() * 100
    score_list.push(copy_score)
  }

  return (
    <>
      {
        loaded ?
          <>
            <ScoreSearchForm />
            <h1 className='text-xl'>検索結果は {Object.keys(score_list).length}件 でした～</h1>
            {score_list.map((score: Score) => <ScoreContent score={score} key={String(score.id)} />)}
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