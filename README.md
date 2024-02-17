# taiki-karaoke

## 初期設定

```bash
docker compose run --rm node sh -c "yarn global add create-react-app && create-react-app karaoke --template typescript"
```

コンテナ内に入って行ったこと

```bash
yarn add -D tailwindcss postcss autoprefixer cssnano
yarn tailwindcss init -p
```

## 別の PC から初めてコンテナ起動した場合

```bash
docker compose run --rm node sh -c "yarn global add create-react-app"
```
