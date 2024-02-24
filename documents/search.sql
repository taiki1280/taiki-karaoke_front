-- 全件検索
SELECT
      "requestNo" 
FROM
    karaoke_music 
    INNER JOIN karaoke_artist 
        ON karaoke_artist.id = karaoke_music.artist_id 
        AND karaoke_artist."artistName" LIKE 'ヨルシカ%' 
ORDER BY
    "requestNo"
;

SELECT * FROM karaoke_music WHERE "requestNo" = '5299-20';
