import { FC } from 'react'
import { Link } from 'react-router-dom'

interface Score {
  // id: Number,
  scoringDateTime: String
  totalPoints: String
  // Ai
  aiSensitivityBonus: String | null
  // DX-G
  bonusPoint: String | null
  requestNo__artist__artistName: String
  requestNo__contentsName: String
}

const ScoreContent = (props: { score: Score }) => {
  const total_point: String = (Number(props.score.totalPoints) / 1000).toFixed(
    3
  )
  // 素点を計算（現状、Aiボーナス点は計算内にしか使用されていない）
  const point: String = (
    (Number(props.score.totalPoints) -
      Number(props.score.aiSensitivityBonus || props.score.bonusPoint)) /
    1000
  ).toFixed(3)
  return (
    <div className="py-2 border-b-2">
      <time className="date_time px-4 text-xs">
        {props.score.scoringDateTime}
      </time>
      <div className="flex items-center justify-evenly">
        <div className="basis-3/12 flex flex-col items-center md:basis-1/12">
          <span className="point text-lg">{point}</span>
          <div className="flex items-center justify-around w-full">
            <span className="total_point basis-full text-center text-xs">
              {total_point}
            </span>
            <Link
              className="detail basis-full text-center text-xs text-blue-500 underline underline-offset-1"
              to={`/score/${props.score.scoringDateTime}`}
            >
              詳細
            </Link>
          </div>
        </div>
        <div className="basis-8/12 flex flex-col md:basis-10/12">
          <span className="d_artist_name text-xs">
            {props.score.requestNo__artist__artistName}
          </span>
          <cite className="d_contents_name text-lg">
            {props.score.requestNo__contentsName}
          </cite>
        </div>
      </div>
    </div>
  )
}

export default ScoreContent
