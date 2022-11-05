import React, { useState, useEffect } from 'react'
// import { getScore, getArtistNameList } from '../api/getScore'
// import { useCookies } from 'react-cookie';

function ScoreSearchForm() {
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

  // const [loaded, setLoaded] = useState(true)
  const [score, setScore] = useState()
  // const [artistNameList, setArtistNameList] = useState()

  let loaded = false

  let artistNameList = [
    'dummy_artist_name1',
    'dummy_artist_name2',
    'dummy_artist_name3',
  ]

  // const [cookies, setCookie, removeCookie] = useCookies();
  // if (Object.keys(cookies).length !== 0) {
  //   console.log(cookies)
  //   param = cookies
  // }


  const selectedArtistNameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    param.artist_name = e.target.value
    // setCookie(e.target.id, e.target.value)
    // replaceScore(param)
  }

  const inputSongNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    param.contents_name = e.target.value
    // setCookie(e.target.id, e.target.value)
    // replaceScore(param)
  }

  const selectedBySongChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    param.by_song = e.target.value
    // setCookie(e.target.id, e.target.value)
    // replaceScore(param)
  }

  const selectedOrderByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    param.order_by = e.target.value
    // setCookie(e.target.id, e.target.value)
    // replaceScore(param)
  }

  // const replaceScore = (param) => {
  //   getScore(param)
  //     .then(d => {
  //       setScore(d)
  //     })
  //     .catch(e => {
  //       throw new Error(e)
  //     })
  // }

  const deleteCookie = () => {
    // for (const value in param)
    //   removeCookie(value)
    window.location.reload()
  }

  useEffect(() => {
    // getArtistNameList()
    //   .then(d => {
    //     let artistNameList = d
    //     console.log(d)
    //     artistNameList.unshift('未選択')
    //     setArtistNameList(d)
    //   })
    //   .catch(e => {
    //     throw new Error(e)
    //   })
    // getScore(param)
    //   .then(d => {
    //     setScore(d)
    //     // Loading完了
    //     setLoaded(false)
    //   })
    //   .catch(e => {
    //     throw new Error(e)
    //   })
  }, [])



  return (
    <>
      {
        loaded ?
          <>
            <div className='flex justify-end'>
              <button className='bg-red-600 p-1 border-2 rounded-lg' onClick={deleteCookie}>
                検索履歴削除
              </button>
            </div>
            <div className='p-1'>
              アーティスト名
              <select
                className='bg-black w-full p-1 border-2 rounded-md'
                name='artist_name'
                id='artist_name'
                onChange={(e) => selectedArtistNameChange(e)}
                defaultValue={param.artist_name}>
                {artistNameList.map((d, i) => <option key={i} value={d !== '未選択' ? d : ''}>{d}</option>)}
              </select>
            </div>
            <div className='p-1'>
              曲名
              <input
                className='bg-black w-full p-1 border-2 rounded-md'
                type='text'
                name='contents_name'
                id='contents_name'
                onChange={(e) => inputSongNameChange(e)}
                defaultValue={param.contents_name} />
            </div>
            <div className='p-1'>
              重複曲絞り込み
              <select
                className='bg-black w-full p-1 border-2 rounded-md'
                name='by_song'
                id='by_song'
                onChange={(e) => selectedBySongChange(e)}
                defaultValue={param.by_song}>
                {bySongList.map((d, i) => <option key={i} value={d.value}>{d.label}</option>)}
              </select>
            </div>
            <div className='p-1'>
              ソート順
              <select
                className='bg-black w-full p-1 border-2 rounded-md'
                name='order_by'
                id='order_by'
                onChange={(e) => selectedOrderByChange(e)}
                defaultValue={param.order_by}>
                {orderByList.map((d, i) => <option key={i} value={d.value}>{d.label}</option>)}
              </select>
            </div>
          </>
          :
          <div>
            {/* <h1 className='text-base text-center font-semibold p-4'>Now Loading...</h1> */}
            <h1 className='text-base text-center font-semibold p-4'>検索フォーム開発中</h1>
          </div>
      }
    </>
  )
}

export default ScoreSearchForm