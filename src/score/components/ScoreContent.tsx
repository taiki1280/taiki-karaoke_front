import { FC } from 'react';
import { Link } from 'react-router-dom';

interface Score {
  score: {
    date_time: String,
    point: Number,
    total_point: Number,
    id: Number,
    song: {
      d_artist_name: String
      d_contents_name: String
    }
  }
}

const ScoreContent: FC<Score> = ({ score }) => {
  // let col_span = 7;
  // <div className="list">
  //   <span className="point">{score.point.toFixed(3)}</span>
  //   <time className="date_time">{score.date_time}</time>
  //   <span className="total_point">{score.total_point.toFixed(3)}</span>
  //   <cite className="d_contents_name">{score.song.d_contents_name}</cite>
  //   <Link className="detail" to={`score/${score.id}`}>詳細</Link>
  //   <span className="d_artist_name">{score.song.d_artist_name}</span>
  // </div>
  return (
    <div className="py-2 border-b-2">
      <time className="date_time px-4 text-xs">{score.date_time}</time>
      <div className='flex items-center justify-evenly'>
        <div className='basis-3/12 flex flex-col items-center md:basis-1/12'>
          <span className='point text-lg'>{score.point.toFixed(3)}</span>
          <div className='flex items-center justify-around w-full'>
            <span className="total_point basis-full text-center text-xs">{score.total_point.toFixed(3)}</span>
            <Link className="detail basis-full text-center text-xs text-blue-500 underline underline-offset-1" to={`score/${score.id}`}>詳細</Link>
          </div>
        </div>
        <div className='basis-8/12 flex flex-col md:basis-10/12'>
          <span className="d_artist_name text-xs">{score.song.d_artist_name}</span>
          <cite className="d_contents_name text-lg">{score.song.d_contents_name}</cite>
        </div>
      </div>
    </div>
  )
}

export default ScoreContent