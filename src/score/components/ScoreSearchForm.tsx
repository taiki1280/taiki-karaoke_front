import {useState, useEffect} from 'react'
import axios from 'axios'

interface SearchValues {
  denmoku: string
  artistName: string
  contentsName: string
  bySong: string
  orderBy: string
}

// TODO: Stateメソッドのタイプを調べる
function ScoreSearchForm(props: any) {
  const searchValues: SearchValues = {
    denmoku: localStorage.getItem('denmoku') ?? '',
    artistName: localStorage.getItem('artistName') ?? '',
    contentsName: localStorage.getItem('contentsName') ?? '',
    bySong: localStorage.getItem('bySong') ?? '',
    orderBy: localStorage.getItem('orderBy') ?? '',
  }

  const denmokuList = [
    {value: 'ai', label: '精密採点 AI'},
    {value: 'dxg', label: '精密採点 DX-G'},
    // { value: 'dx', label: '精密採点 DX' },
  ]

  const bySongList = [
    {value: '', label: '未選択'},
    {value: 'max_point', label: '素点（自己ベスト）'},
    {value: 'min_point', label: '素点（自己ワースト）'},
    {value: 'max_total_point', label: '総合点（自己ベスト）'},
    {value: 'min_total_point', label: '総合点（自己ワースト）'},
  ]

  const orderByList = [
    {value: 'date_time', label: '日付（昇順）'},
    {value: '-date_time', label: '日付（降順）'},
    {value: 'point', label: '素点（昇順）'},
    {value: '-point', label: '素点（降順）'},
    {value: 'total_point', label: '総合点（昇順）'},
    {value: '-total_point', label: '総合点（降順）'},
    {value: 'song__artist_name', label: 'アーティスト名（昇順）'},
    {value: '-song__artist_name', label: 'アーティスト名（降順）'},
    {value: 'song__contents_name', label: '曲名（昇順）'},
    {value: '-song__contents_name', label: '曲名（降順）'},
  ]
  const [loadedArtistNameList, setLoadedArtistNameList] = useState<Boolean>(false)
  const [artistNameList, setArtistNameList] = useState<string[]>([])

  const handleDeleteLocalStorage = () => {
    localStorage.clear()
    window.location.reload()
  }

  useEffect(() => {
    // 取得済の場合、実行しない
    if (loadedArtistNameList) return

    if (process.env.REACT_APP_DJANGO_APP_API_URL === null) return

    axios.get(process.env.REACT_APP_DJANGO_APP_API_URL + 'artist/').then((res) => {
      // APIからデータ取得
      let artistNameList: string[] = res.data.map((d: any) => d.artist_name)
      artistNameList = ['未選択', 'ヨルシカ', 'suis from ヨルシカ', 'ヨルシカメドレー', 'YOASOBI'].concat(
        artistNameList,
      )
      artistNameList = Array.from(new Set(artistNameList))
      console.log('アーティスト一覧')
      console.log(artistNameList)
      setArtistNameList(artistNameList)
      setLoadedArtistNameList(true)
    })
  }, [loadedArtistNameList])

  return (
    <>
      {loadedArtistNameList ? (
        <form>
          <div className='flex justify-end'>
            <button
              className='bg-red-600 p-1 border-2 rounded-lg'
              onClick={handleDeleteLocalStorage}
            >
              検索履歴削除
            </button>
          </div>
          <div className='p-1'>
            デンモク
            <select
              className='bg-black w-full p-1 border-2 rounded-md'
              name='denmoku'
              id='denmoku'
              onChange={(event) => {
                localStorage.setItem('denmoku', event.target.value)
                // デンモクを変更したときは api が変わるので未取得ステータスへ更新
                props.setLoadedScoreList(false)
                props.selectedDenmokuChange(event.target.value)
              }}
              defaultValue={searchValues.denmoku}
            >
              {denmokuList.map((d, i) => (
                <option
                  key={i}
                  value={d.value}
                >
                  {d.label}
                </option>
              ))}
            </select>
          </div>
          <div className='p-1'>
            アーティスト名
            <select
              className='bg-black w-full p-1 border-2 rounded-md'
              name='artist_name'
              id='artist_name'
              onChange={(event) => {
                localStorage.setItem('artistName', event.target.value)
                props.selectedArtistNameChange(event.target.value)
              }}
              defaultValue={searchValues.artistName}
            >
              {artistNameList.map((d: string, i: number) => (
                <option
                  key={i}
                  value={d !== '未選択' ? d : ''}
                >
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div className='p-1'>
            曲名
            <input
              className='bg-black w-full p-1 border-2 rounded-md'
              type='text'
              name='contents_name'
              id='contents_name'
              onChange={(event) => {
                console.log(event.target.name)
                localStorage.setItem('contentsName', event.target.value)
                props.inputSongNameChange(event.target.value)
              }}
              defaultValue={searchValues.contentsName}
            />
          </div>
          <div className='p-1'>
            重複曲絞り込み
            <select
              className='bg-black w-full p-1 border-2 rounded-md'
              name='by_song'
              id='by_song'
              onChange={(event) => {
                localStorage.setItem('bySong', event.target.value)
                props.selectedBySongChange(event.target.value)
              }}
              defaultValue={searchValues.bySong}
            >
              {bySongList.map((d, i) => (
                <option
                  key={i}
                  value={d.value}
                >
                  {d.label}
                </option>
              ))}
            </select>
          </div>
          <div className='p-1'>
            ソート順
            <select
              className='bg-black w-full p-1 border-2 rounded-md'
              name='order_by'
              id='order_by'
              onChange={(event) => {
                localStorage.setItem('orderBy', event.target.value)
                props.selectedOrderByChange(event.target.value)
              }}
              defaultValue={searchValues.orderBy}
            >
              {orderByList.map((d, i) => (
                <option
                  key={i}
                  value={d.value}
                >
                  {d.label}
                </option>
              ))}
            </select>
          </div>
        </form>
      ) : (
        <div>
          <h1 className='text-base text-center font-semibold p-4'>Loading search form...</h1>
        </div>
      )}
    </>
  )
}

export default ScoreSearchForm
