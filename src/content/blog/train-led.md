---
title: RaspberryPiで側面行先表示機を自作してみた
author: starprivate55
tags:
  - ラズパイ
  - 鉄道 
pubDate: 2023-10-15
---

## はじめに

どうもこんにちはホシノです。

今回は、Raspberry PiとLEDマトリクスを使用して、JR東日本E233系の行先表示機（側面）を作ったので紹介します。

## 構成

![構成図](https://cdn.tgrgroup.jp/images/9D23F41A-F173-5D5B-6882-F79DC5D62AD5.webp)

このような構成で制作しています。

今回の例では、AC電源から直接LEDマトリクスに給電していますが、Adafruit RGB Matrix HAT + RTCを介しての給電もできそうです。

## 必要なもの

今回紹介する中には、はんだ付けが必要なものがあります。  
また、購入場所は投稿主が購入した場所です。参考程度で見てください。

| 必要部品 | 数量 | 購入場所 | 推定価格（円） |  
| ---- | :----: | ----: | ----: |
| LEDマトリクス 32×64 | 2 | Aliexpless | 4,000 |  
| Raspberry Pi | 1 | メルカリ | 5,000 |  
| Adafruit RGB Matrix HAT + RTC | 1 | Amazon | 4,000 |  
| AC 5V電源（4A以上） | 1 | Amazon | 1,500 |  
| 合計 | - | - | 14,500 |

ケーブルなどの基本付属するようなものは上記には含んでいません。  
付属していないなどで必要であれば追加で購入してください。

## 各部品の説明

### LEDマトリクス
LEDマトリクスといってもいろいろな種類がありますが、今回使用するのはHUB-75規格の64×32ドットのパネルです。

今回作る行先表示機は128×32ドットのため、64×32では横方向のドットが足りないので2枚使用して128×32にします。

### Raspberry Pi
Raspberry Piは一枚の基板にCPUや入出力インターフェースがついている小型のマイコンボードです。

現在、Raspberry Piには1～4のバージョンがありますが、購入する場合は最低でもRaspberry Pi 3 Model B以上を選んだほうがいいと思います。

私はRaspberry Pi 3 Model B+を選びました。

### Adafruit RGB Matrix HAT + RTC
Adafruit RGB Matrix HAT + RTCはRaspberry Piに接続してHUB-75規格のLEDマトリクスを制御できるインターフェース基板です。

日本だとマルツ電波やAmazonで購入ができます。

なお、コネクタ類ははんだ付けの必要があるので注意です。

### AC 5V電源（4A以上）
電源はRaspberry PiとLEDマトリクスに使用しますが、ここで挙げる電源はLEDマトリクスに使用する電源です。

LEDマトリクスは64×32ドットだと2A/枚が目安となっており、今回は2枚使用するので4A程度のものを用意したほうがよさそうです。

ただし投稿主が試したら2.5Aでも動作しましたので、3Aくらいでも良いかもしれませんね。


## ハードウェアの準備

実際に組み立てを行っていきたいと思います。  
なおこのパートでははんだ付け等はされてる前提で進めていきます。

#### Adafruit RGB Matrix HAT + RTCをRaspberry Piにつける

Raspberry PiのGPIOとAdafruit RGB Matrix HAT + RTCのGPIOを合体させます。

間違った向きに付いたりするので注意してください。

<img src="https://cdn.tgrgroup.jp/images/41EEC79C-5388-04BF-00D5-8A2C9E8D059C.webp" width="50%">

#### LEDマトリクスをRaspberry Piと接続する

LEDマトリクスに付属している16pinフラットケーブルを、LEDマトリクス二枚同士とインターフェース基板のHUB75のコネクタにつなぎます。

LEDマトリクスには入力用と出力用のコネクタに分かれています。  
基板にプリントされている矢印の向きにデータが流れるので、矢印が向いている先が出力用、その反対が入力用だと考えてください（パネルによってはプリントされていません）

#### LEDマトリクスに5Vを流す

AC 5V電源（4A以上）からプラスマイナスを取り付属した電源用ケーブルにつなぎます。

このときプラスマイナスを間違えるとLEDマトリクスの故障につながるので注意してください。  
テスターなんかで調べるといいでしょう。

#### Raspberry Piに各種ケーブルを接続する

HDMIケーブルやLANケーブル、キーボード、マウスなどを接続する。

## ソフトウェアの準備

ソフトウェアの準備を進めます。  
Raspberry Piに必要なMicro SDカードを準備してください。

### Raspberry Pi OSを導入する

今回はRaspberry Pi OSを導入しますが既に導入している場合はここはスキップで構いません。  
また、導入方法はほかで詳しく解説されてるので、ここではざっと説明します。

#### Imagerのインストール

お使いのPCでRaspberry Pi公式の[ダウンロードページ](https://www.raspberrypi.com/software/)からお使いのOS（Windows,Mac,Ubuntu）から選択してimagerをインストールしてください。

#### Raspberry Pi OSをSDカードにインストール

1. 8GB以上のMicro SDカードをPCに接続して、Raspberry Pi Imagerを開いてください。

2. 「OSを選ぶ」から一番上のRaspberry Pi OSを選んでください。

3. 「ストレージを選ぶ」から先ほど接続したMicro SDカードを選択します。<br>書き込み先のストレージのデータはすべて削除されるので、間違えないように注意してください。

4. 「書き込む」をクリックしてください。<br>確認ダイアログが表示されるので「はい」を選択してください。

5. 「Raspberry Pi OS（32bit）は○○に書き込まれました。」と出れば成功です。

### flickLEDとrpi-rgb-led-matrixをインストール

#### flickLEDをクローンする

今回は[acela86](https://github.com/acela86)さんの[flickLED](https://github.com/acela86/flickLED)をクローンするのですが、Python3では動作しません。  
Python2にダウングレードする方法もあるようですが、めんどくさいので今回はTGR Groupの技術部の方がflickLEDをPython3でも動くように書き換えてくれたので、それを使います。

下記のコマンドを実行しRaspberry Piにレポジトリをクローンします。
```bash
git clone https;//github.com/TGR-Group/flickLED.git
cd flickLED
pip3 install -U -r requirements.txt
```
クローンしたディレクトリ内で下記のコマンドを実行しPythonのスクリプトファイルに実行権限を付与します。
```bash
chmod u+x *.py
chmod a+x ./cgi-bin/*.py
```


#### rpi-rgb-led-matrixをインストールする
Adafruitのサイトにある[Driving Matrices](https://learn.adafruit.com/adafruit-rgb-matrix-plus-real-time-clock-hat-for-raspberry-pi/driving-matrices)のStep 6. Log into your Pi to install and run softwareに沿ってインストールしていきます。

下記のコマンドを実行しrpi-legb-led-matrixをインストールします。
```bash
curl https;//raw.githubusercontent.com/adafruit/Raspberry-Pi-Installer-Scripts/main/rgb-matrix.sh > rgb-matrix.sh
sudo bash rgb-matrix.sh
```

## ソフトウェアの実行

#### 起動させる
クローンしたディレクトリ内で下記のコマンドを実行しソフトウェアを起動させます。
```bash
sudo ./app.py
```

起動すると［ 普通｜前橋 ］が表示されます。  

#### 操作する
WEBブラウザ上でRaspberry Pi（ポート番号：8000）にアクセスすると操作ができる画面に移動できます。（デフォルトURL：`http://raspberrypi.local:8000`）

## まとめ

今回は行先表示機を制作してみました。  
以前からTwitterなどで見かけて気になっていたので、今回制作することができてとてもうれしいです。

少しいじれば、他にも新たに幕を追加もできるのでみんなもやってみてね。
