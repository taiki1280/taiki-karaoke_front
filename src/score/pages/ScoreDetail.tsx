interface ScoreDetailProps {
  radar_chart_pitch: Number;
  radar_chart_expressive: Number;
  song: {
    artist_name: String;
    contents_name: String;
  };
  total_point: Number;
  point: Number;
  bonus_type: String;
  bonus_point: Number;
  national_average_total_points: Number;
  last_total_points: String;
  analysis_report_comment: {
    comment: String;
  };
  intonation: Number;
  shakuri_count: Number;
  kobushi_count: Number;
  fall_count: Number;
  longtone_skill: String;
  radar_chart_stability: Number;
  timing: Number;
  vibrato_total_second: Number;
  vibrato_count: Number;
  vibrato_skill: String;
  vibrato_type: String;
  singing_range_highest: Number;
  singing_range_lowest: Number;
  vocal_range_highest: Number;
  vocal_range_lowest: Number;
}

const ScoreDetail = () => {
  let loading = false;

  let scoreDetail: ScoreDetailProps = {
    radar_chart_pitch: Math.floor(Math.random() * 10),
    radar_chart_expressive: Math.floor(Math.random() * 10),
    song: {
      artist_name: 'artist_name',
      contents_name: 'contents_name',
    },
    total_point: Math.floor(Math.random() * 1000),
    point: Math.floor(Math.random() * 1000),
    bonus_type: '',
    bonus_point: Math.floor(Math.random() * 1000),
    national_average_total_points: Math.floor(Math.random() * 1000),
    last_total_points: '',
    analysis_report_comment: {
      comment: 'コメント',
    },
    intonation: Math.floor(Math.random() * 10),
    shakuri_count: Math.floor(Math.random() * 10),
    kobushi_count: Math.floor(Math.random() * 10),
    fall_count: Math.floor(Math.random() * 10),
    longtone_skill: '',
    radar_chart_stability: Math.floor(Math.random() * 10),
    timing: Math.floor(Math.random() * 10),
    vibrato_total_second: Math.floor(Math.random() * 10),
    vibrato_count: Math.floor(Math.random() * 10),
    vibrato_skill: '',
    vibrato_type: '',
    singing_range_highest: Math.floor(Math.random() * 10),
    singing_range_lowest: Math.floor(Math.random() * 10),
    vocal_range_highest: Math.floor(Math.random() * 10),
    vocal_range_lowest: Math.floor(Math.random() * 10),
  };
  return (
    <>
      {loading ? (
        <h1>loading....</h1>
      ) : (
        <>
          <div>
            <p>音程・表現力グラフ</p>
            {/* <p>音程：{scoreDetail.radar_chart_pitch} %</p>
            <p>表現力：{scoreDetail.radar_chart_expressive} 点</p> */}
            {/* <div className='flex justify-around'>
              <PitchGraph data={scoreDetail}></PitchGraph>
            </div> */}
          </div>
          <p>表現力チャート</p>
          <div className='flex justify-around'>
            {/* <ExpressionRadarChart data={scoreDetail}></ExpressionRadarChart> */}
          </div>
          <div>
            <p>アーティスト名：{scoreDetail.song.artist_name}</p>
            <p>曲名：{scoreDetail.song.contents_name}</p>
            <hr />
            <p>総合点：{String(scoreDetail.total_point)} 点</p>
            <p>素点：{String(scoreDetail.point)} 点</p>
            <p>ボーナスタイプ：{scoreDetail.bonus_type}</p>
            <p>ボーナスポイント：{String(scoreDetail.bonus_point)} 点</p>
            <p>全国平均：（取得時？日々変わる？）：{String(scoreDetail.national_average_total_points)} 点</p>
            <p>前回点数：{scoreDetail.last_total_points}</p>
            <hr />
            <p>分析レポート：{scoreDetail.analysis_report_comment.comment}</p>
            <hr />
            <p>抑揚：{String(scoreDetail.intonation)} 点</p>
            <p>しゃくり：{String(scoreDetail.shakuri_count)} 回</p>
            <p>こぶし{String(scoreDetail.kobushi_count)} 回</p>
            <p>フォール：{String(scoreDetail.fall_count)} 回</p>
            <hr />
            <p>ロングトーン 上手さ：{scoreDetail.longtone_skill} / 10</p>
            <p>安定性（チャートの情報？？？）：{String(scoreDetail.radar_chart_stability)}</p>
            <p>タメ？：{String(scoreDetail.timing)}</p>
            <p>ビブラート 合計：{String(scoreDetail.vibrato_total_second)} 秒</p>
            <p>ビブラート 回数：{String(scoreDetail.vibrato_count)} 回</p>
            <p>ビブラート 上手さ：{scoreDetail.vibrato_skill} / 10</p>
            <p>ビブラート タイプ：{scoreDetail.vibrato_type}</p>
            <p>最高声域（曲？）：{String(scoreDetail.singing_range_highest)}</p>
            <p>最低声域（曲？）：{String(scoreDetail.singing_range_lowest)}</p>
            <p>最高声域（自分？）：{String(scoreDetail.vocal_range_highest)}</p>
            <p>最低声域（自分？）：{String(scoreDetail.vocal_range_lowest)}</p>
            <hr />
          </div>

          {/* <h1 className='text-3xl py-2'>Songテーブル</h1>
          <div className='ml-4'>
            {get_table_data(scoreDetail.song)}
          </div>
          <h1 className='text-3xl py-2 mt-2'>analysisReportCommentテーブル</h1>
          <div className='ml-4'>
            {get_table_data(scoreDetail.analysis_report_comment)}
          </div>
          <h1 className='text-3xl py-2 mt-2'>Scoreテーブル</h1>
          <div className='ml-4'>
            {get_table_data(scoreDetail)}
          </div> */}
        </>
      )}
    </>
  );
};

export default ScoreDetail;
