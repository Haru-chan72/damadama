// js/bgm-player.js

document.addEventListener('DOMContentLoaded', () => {
    const myBGM = document.getElementById('myBGM');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const volumeSlider = document.getElementById('volumeSlider');

    let isPlaying = false; // 再生中かどうかのフラグ

    // --- ☆追加：localStorageから状態を読み込む処理☆ ---
    const savedState = localStorage.getItem('bgmState');
    if (savedState) {
        const state = JSON.parse(savedState);
        myBGM.currentTime = state.time; // 再生位置を復元
        myBGM.volume = state.volume;   // 音量を復元
        volumeSlider.value = state.volume; // スライダーも同期
        if (state.playing) {
            // 自動再生ポリシーのため、play()はユーザー操作がないと失敗する可能性がある
            // この場合、ボタンが「一時停止」状態になるようにだけしておき、
            // 実際に再生されるのはユーザーが再度ボタンをクリックした時になることが多い。
            // もしくは、後述のユーザー操作フラグで対策する。
            isPlaying = true;
            playPauseBtn.textContent = 'BGM一時停止';
            // myBGM.play() はDOMContentLoadedで直接呼ばない方が安全
            // ページロード時の自動再生ブロックを考慮し、ユーザーの最初のクリックを待つ。
        }
    } else {
        // 初回訪問時や状態が保存されていない場合
        myBGM.volume = volumeSlider.value; // 初期音量設定
    }
    // --- ☆ここまで追加☆ ---

    // 初期音量を設定
    myBGM.volume = volumeSlider.value;

    // 再生/一時停止ボタンのクリックイベント
    playPauseBtn.addEventListener('click', () => {
        if (isPlaying) {
            myBGM.pause(); // 一時停止
            playPauseBtn.textContent = 'BGM再生'; // ボタンのテキストを変更
        } else {
            // Promiseを返すplay()メソッドは、失敗する可能性があるためcatchでエラーハンドリング
            myBGM.play().then(() => {
                // 再生成功時
                playPauseBtn.textContent = 'BGM一時停止';
            }).catch(error => {
                // 再生失敗時 (ブラウザの自動再生ポリシーなどでブロックされた場合)
                console.error("BGMの再生に失敗しました:", error);
                alert("BGMの再生がブロックされました。ブラウザの自動再生設定をご確認ください。");
                playPauseBtn.textContent = 'BGM再生'; // ボタンを元に戻す
            });
        }
        isPlaying = !isPlaying; // フラグを反転
        // --- ☆追加：再生状態を保存☆ ---
        saveBGMState();
        // --- ☆ここまで追加☆ ---
    });

    // 音量スライダーの変更イベント
    volumeSlider.addEventListener('input', () => {
        myBGM.volume = volumeSlider.value; // スライダーの値に合わせて音量を設定
        // --- ☆追加：音量変更時も状態を保存☆ ---
        saveBGMState();
        // --- ☆ここまで追加☆ ---
    });

    // BGMが終了したら（loop属性があるので基本はここには来ないが念のため）
    myBGM.addEventListener('ended', () => {
        isPlaying = false;
        playPauseBtn.textContent = 'BGM再生';
        // --- ☆追加：終了時も状態を保存（再生停止状態を記録）☆ ---
        saveBGMState();
        // --- ☆ここまで追加☆ ---
    });

     // --- ☆追加：状態をlocalStorageに保存する関数☆ ---
    function saveBGMState() {
        const state = {
            playing: isPlaying,
            time: myBGM.currentTime,
            volume: myBGM.volume
        };
        localStorage.setItem('bgmState', JSON.stringify(state));
    }
    // --- ☆ここまで追加☆ ---

      // --- ☆追加：ページを離れる直前に状態を保存する☆ ---
    window.addEventListener('beforeunload', saveBGMState);
    // --- ☆ここまで追加☆ ---

    // ユーザーがブラウザの音量でミュートした場合にボタン表示を同期
    myBGM.addEventListener('volumechange', () => {
        if (myBGM.muted || myBGM.volume === 0) {
            // playPauseBtn.textContent = 'BGM再生 (ミュート)'; // 好みで表示を変える
        } else if (isPlaying && myBGM.volume > 0) {
            // playPauseBtn.textContent = 'BGM一時停止'; // 音量がある場合
        }
    });
});