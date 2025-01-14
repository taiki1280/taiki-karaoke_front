import { Link } from 'react-router-dom';

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

const ScoreContent = (props: { score: Score; denmoku: String; isSortedTotalPoint: Boolean }) => {
  let total_point: String = (Number(props.score.total_points) / 1000).toFixed(3);
  // 素点を計算（現状、Aiボーナス点は計算内にしか使用されていない）
  let point: String = (
    (Number(props.score.total_points) - Number(props.score.ai_sensitivity_bonus || props.score.bonus_point)) /
    1000
  ).toFixed(3);

  if (props.isSortedTotalPoint) {
    // ソート順が総合点（昇順） or 総合点（降順）であった場合、
    // 総合点と素点の中身を入れ替えて表示する
    let tmp = total_point;
    total_point = point;
    point = '（総）' + tmp;
  }

  return (
    <div className='py-2 border-b-2'>
      <time className='date_time px-4 text-xs'>{props.score.scoring_date_time}</time>
      <div className='flex items-center justify-evenly'>
        <div className='basis-3/12 flex flex-col items-center md:basis-1/12'>
          <span className='point text-lg'>{point}</span>
          <div className='flex items-center justify-around w-full'>
            <span className='total_point basis-full text-center text-xs'>{total_point}</span>
            <Link
              className='detail basis-full text-center text-xs text-blue-500 underline underline-offset-1'
              to={`/score/${props.score.scoring_date_time}`}
            >
              詳細
            </Link>
          </div>
        </div>
        <div className='basis-8/12 flex flex-col md:basis-10/12'>
          <span className='d_artist_name text-xs'>{props.score.music__artist__artist_name}</span>
          <cite className='d_contents_name text-lg'>{props.score.music__contents_name}</cite>
        </div>
      </div>
    </div>
  );
};

export default ScoreContent;
