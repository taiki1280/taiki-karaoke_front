import ScoreContent from '../components/ScoreContent'

const ScoreList = () => {

  let param = {
    artist_name: 'ヨルシカ',
    contents_name: '',
    by_song: 'max_point',
    order_by: 'point'
  }

  const bySongList = [
    { value: '', label: '未選択' },
    { value: 'max_point', label: '素点（自己ベスト）' },
    { value: 'min_point', label: '素点（自己ワースト）' },
    { value: 'max_total_point', label: '総合点（自己ベスト）' },
    { value: 'min_total_point', label: '総合点（自己ワースト）' }
  ]

  const orderByList = [
    { value: 'date_time', label: '日付（昇順）' },
    { value: '-date_time', label: '日付（降順）' },
    { value: 'point', label: '素点（昇順）' },
    { value: '-point', label: '素点（降順）' },
    { value: 'total_point', label: '総合点（昇順）' },
    { value: '-total_point', label: '総合点（降順）' },
    { value: 'song__artist_name', label: 'アーティスト名（昇順）' },
    { value: '-song__artist_name', label: 'アーティスト名（降順）' },
    { value: 'song__contents_name', label: '曲名（昇順）' },
    { value: '-song__contents_name', label: '曲名（降順）' },
  ]

  let loading = false;

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

  var score_list: Score[] = new Array();

  for (let i = 1; i <= 50; i++) {
    let copy_score = Object.assign({}, score);
    let copy_song = Object.assign({}, score.song);
    copy_song['d_contents_name'] += String(i);
    copy_score['song'] = copy_song;
    copy_score['id'] = i;
    score_list.push(copy_score);
  }


  return (
    <>
      {
        loading ?
          <div>
            <h1 className='text-5xl text-center font-semibold p-10'>Now Loading...</h1>
            <h1 className='text-5xl text-center font-semibold p-10'>データ取得中だよ～</h1>
          </div>
          :
          <>
            <h1 className='text-xl'>検索結果は {Object.keys(score_list).length}件 でした～</h1>

            {
              score_list.map(
                (score: Score) => {
                  return <ScoreContent score={score} />;
                }
              )
            }
          </>
      }
    </>
  )
}

export default ScoreList