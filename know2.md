

#########################################
# Command
#########################################

### 1. Command ###
find . -iname mainview*
touch -t "201610041200" timestamp
find . -type f -newer timestamp
egrep -ilrnH --include=*.java ‘beacon.pntbiz.com’ ./

sudo xcode-select -s /Applications/XCode7.2/Xcode.app/
To clear the terminal manually: Cmd + K
ps aux | grep chrome

export PS1="\W \u$ "

Homebrew: ruby -e "$(curl -fsSL https://bit.ly/1LEgSWs)"

brew/nvm
brew upgrade node
nvm node(nodejs) uninstall: nvm uninstall v8.10.0

#### File Transfer
Download: scp carnd@54.249.240.135:/home/abc/index.html ./
Upload: scp ./index.html carnd@54.249.240.135:/home/abc/index.html

#### Tar & Zip
Zip Foler
tar --exclude='./BLE/.git' -cvzf output_filename.tar.gz folder_name --exclude='./BLE/.git'
tar -xvzf xxx.tar.gz

Zip extract
sudo apt-get install unzip
unzip file.zip -d destination_folder

echo 'export PATH=/usr/local/bin:$PATH' >> ~/.bash_profile

#### File Upload to Google Drive(https://github.com/prasmussen/gdrive)
poohex id: 0B6E3rj3qrE6NMTRxYU41T1REXzQ
Install on Mac
brew install gdrive

#### Install on Linux
cd~
wget "https://docs.google.com/uc?id=0B3X9GlR6EmbnWksyTEtCM0VfaFE&export=download"
mv "uc?id=0B3X9GlR6EmbnWksyTEtCM0VfaFE&export=download" gdrive
chmod +x gdrive
sudo install gdrive /usr/local/bin/gdrive

#### Git
Git 새로 만들기 
echo "# dlnd-deep-learning" >> README.md
git init
git add README.md
git commit -m "first commit"
git remote add origin https://github.com/linked0/dlnd-deep-learning.git
git push -u origin master
지워진 폴더에 대한 스테이징
git rm -r app

수정 원복: git checkout HEAD .
커밋 제거: git reset HEAD^    // 최종 커밋을 취소. 워킹트리는 보존됨. (커밋은 했으나 push하지 않은 경우 유용)
푸시 제거 삭제: git reset -soft HEAD^ (커밋하고 푸시까지 된 것 한개만 제거)
변경파일 commit에 포함시키기: git add benchmarks.rb
git config --global user.name "linked0"
git config --global user.email linked@gmail.com
git push
sername for 'https://github.com': linked0@gmail.com
Password for 'https://linked0@gmail.com@github.com': 

#########################################
### 2. Edit/Vi ###
Visual Studio Code command 실행
shift-cmd-p -> shell command -> terminal에서 code로 실행
mac vim
brew install macvim --override-system-vim
xcode-select install
sudo xcode-select --switch /Library/Developer/CommandLineTools
find ./ -type f > files
find . -type file -name '*.js' -o -name '*.json' > files
find . -type f -not -path './node_modules/*' -not -path './chaindata/*' > files
open -a macvim files
<ctl-w>f: open in a new window
<ctl-w>gf: open in a new tab
<c-w> {H,J,K,L}: move among windows, or use arrow key

"*yy           ; copt from vi 
:! wc          ; sh command in vi

set softtabstop=4       ; TAB키를 눌렀을때 몇 칸을 이동?
set tabstop=4           ; 하나의 TAB을 몇 칸으로 인식? 
set number		            ;  Line Number
set mouse=a             ; Adjust area with mouse

#########################################
### 3. ML ###
sudo tensorboard --logdir='my_graph'

#########################################
### 4. Blockchain ###

#### Encode/Decode
Encode and Decode Text from Terminal
String to hex: xxd -p <<< "Blockchain Developer"
Hex to string: echo 426c6f636b636861696e20446576656c6f7065720a|xxd -r -p

Encode and Decode Text from Terminal Using Files
Create file: touch hello.txt
String to Hex: xxd -p hello.txt helloEncoded.txt
Hex to String: xxd -p -r helloEncoded.txt helloDecoded.txt

Encode and Decode Image from Terminal Using Files
Image to Hex: xxd -p cat.png cat.txt
Hex to Image: xxd -p -r cat.txt catDecoded.png

#########################################
### 5. Cloud/gdrive ###
gcloud compute zones list
gcloud config set compute/zone <zone>
gcloud compute instances create ubuntu \
gcloud compute ssh ubuntu

sudo docker images
sudo docker pull nginx:1.10.0  // download from repository
sudo docker run -d nginx:1.10.0
sudo docker inspect f86cf066c304 // f86cf066c304는 Container ID
sudo docker inspect sharp_bartik // sharp_bartik는 Container Name

#### Create Docker Image
wget https://storage.googleapis.com/golang/go1.6.2.linux-amd64.tar.gz
rm -rf /usr/local/bin/go
sudo tar -C /usr/local -xzf go1.6.2.linux-amd64.tar.gz
export PATH=$PATH:/usr/local/go/bin
export GOPATH=~/go
mkdir -p $GOPATH/src/github.com/udacity
cd $GOPATH/src/github.com/udacity
git clone https://github.com/udacity/ud615.git
cd ud615/app/monolith
go get -u
go build --tags netgo --ldflags '-extldflags "-lm -lstdc++ -static"'

cat Dockerfile
sudo docker build -t monolith:1.0.0 .
sudo docker images monolith:1.0.0
sudo docker run -d monolith:1.0.0
sudo docker inspect <container name or cid>
curl <the container IP>

docker tag -h
sudo docker tag monolith:1.0.0 linked0/monolith:1.0.0  // my account
sudo docker login  // https://hub.docker.com/register/
sudo docker push linked0/example-monolith:1.0.0

#### Kill & Remove Docker Container
docker kill $(docker ps -q)
docker rm $(docker ps -aq)
docker rmi $(docker images dev-* -q)

#### gdrive list
gdrive upload --parent 1u7Gdc1ieGpNYl8trq2RG84wBAKjVk61P eng-math.pdf (upload to poohfiles)
gdrive download 1pI3oIlne8U--qBmTny0mBvahaiQWVdoY (Download file, You can find id)

#### EC2
sudo ssh -i ~/google/poohfiles/jaylee.pem core@ec2-54-95-222-147.ap-northeast-1.compute.amazonaws.com
docker run -d -p 80:80 p0bailey/docker-flask 

AWS: EC Home -> Launch Instance(Blue Button) -> Select CoreOS on Community AMIS -> Select PV
google drive Search: jaylee.pem -> chmod 400 jaylee.pem 
ssh -i ./jaylee.pem core@54.199.65.181 ← CoreOS Instance
ssh -i jaylee.pem ubuntu@52.192.176.112 ← Ubuntu Instance
sudo useradd -m linked0 -> sudo passwd linked0
AWS Installatio on Python Microservice Development Document

#########################################
### 6. python ###
import requests
res = requests.get('https://api.github.com/some/endpoint', headers={'user-agent': 'my-app/0.0.1'})
res = requests.post('http://redmine.pntbiz.com:13000/projects/indoorplus-lbs-sdk/wiki/IOS_Getting_Started', data = {'username':'hjlee','password':'amadeus0'})
conda create -n autobuild python=3.6
conda create -n py3conda python=3.6 anaconda <=이게 anaconda를 관련 패키지를 다 설치해준다.
python3 -c 'import numpy as np; np.save("res", "hello"+"\n")'
python3 -c 'import pyperclip as pc; pc.copy("hello")'
python3 -c 'import tensorflow; print(tensorflow.__version__)'
image show
import matplotlib.image as mpimg
sun = mpimg.imread('images/sunflower.jpg')
plt.imshow(sun)
gray인 경우, plt.imshow(sun_gray, cmap='gray')
cv2로 읽어줘도 됨
img = cv2.imread('images/space_background.jpg')
img = cv2.cvtColor(background_image, cv2.COLOR_BGR2RGB)
Jupyter Notebook Setting

#### 플로팅을 하는 하나의 셀마다 써주는게 좋음. 그래야, 계속 실행시켜도 이전 것이 지워짐.
%matplotlib inline
%config InlineBackend.close_figures=False
%load_ext autoreload			
%autoreload 2
%config InlineBackend.figure_format = 'retina'

#### pandas & numpy
import pandas as pd
pd.set_option('display.height', 1000)
pd.set_option('display.max_rows', 500)
pd.set_option('display.max_columns', 500)
pd.set_option('display.width', 150)
np.set_printoptions(linewidth=1000)

```
Hangul Character
# -*- coding: utf-8 -*-
```

#### Flask
(py36kaggle) kaggle-web hyunjaelee$ export FLASK_APP=app.py
(py36kaggle) kaggle-web hyunjaelee$ export FLASK_DEBUG=1
(py36kaggle) kaggle-web hyunjaelee$ flask run

#########################################
### 7. Android/iOS ###
Toast.makeText(SplashActivity.this, msg, Toast.LENGTH_SHORT).show();

Assistant Editor: Opt-Cmd-Ret

#########################################
### 8. Java/C/Go ###
#### Go
godoc fmt Printf
godoc cmd/fmt
godoc -http=:8001
go build aSourceFile.go
file aSourceFile
go run aSourceFile.go ← Build and Run
go get -v github.com/mactsouk/go/simpleGitHub

Source
package main 
 
import ( 
    "fmt" 
    _ "os" 
) 

import ( 
    "fmt" 
    "github.com/mactsouk/go/simpleGitHub" 
) 
 
func main() { 
    fmt.Println("Hello there!") 
}

#### Java
* Run jar with folder name for class(ex.FirstMDP)
user$ java -cp ./target/classes:/Users/user/.m2/repository/edu/brown/cs/burlap/burlap/3.0.0/burlap-3.0.0.jar FirstMDP

* Compile
javac -cp ./algs4/algs4.jar BinarySearchST.java
java -cp .:./algs4/algs4.jar BinarySearchST < tinyST.txt
java -Xmx1024m <- VM의 Heap을 늘려주기

export JCP=".:~/libjava/stdlib.jar:~/libjava/algs4.jar:~/libjava/utils.jar"
javac -cp $JCP DoublingTest.java 

* Run
java -jar jython_installer-2.7.0.jar

* Jar Making
jar -cvmf manifest.txt utils.jar ./utils/*.class
jar tvf stdlib.jar <- 구조보기 

We first create a text file named Manifest.txt with the following contents:
Main-Class: MyPackage.MyClass

Warning: The text file must end with a new line or carriage return. The last line will not be parsed properly if it does not end with a new line or carriage return.

* JDK Home
~ jay$ /usr/libexec/java_home
/Library/Java/JavaVirtualMachines/jdk1.8.0_144.jdk/Contents/Home

#### C
user$ vi test.cpp
user$ g++ test.cpp
user$ a.out
-bash: a.out: command not found
user$ ./a.out

#########################################
### 9. Not Defined ###

#########################################
### 10. etc ###
* Violent Monkey
YonseiSv
// ==UserScript==
// @name YonseiSv
// @namespace https://wms-sev.iseverance.com
// @grant none
// ==/UserScript==
$(".navbar").height(30);
$(".navbar-branding").height(30);
$(".nav").height(30);
$(".dropdown").height(30);
$(".dropdown-toggle").height(30);

topBar = document.getElementById("topbar")
topBar.style.padding = "0px"
topBar.style.minHeight = "30px"

var utilBtn = document.createElement("BUTTON");        // Create a <button> element
var t = document.createTextNode("Clear");       // Create a text node
utilBtn.appendChild(t);                                // Append the text to <button>
utilBtn.addEventListener("click", function(){
    pntmap.getObjectManager().findTag('node.beacon', function(marker) { marker.setLabelText(String(marker.getData().get('nodeName'))); } )
});
topBar.appendChild(utilBtn);  


pntmap.on('vmarker.rightclick', function(evt) {
alert('hello')
};);


#########################################
# Sites #
#########################################
2EPirzQ, 2NuH39j, 2HksKBZ/2HpHlbi, 2CSmksh, 2CUQTgS

### Work ###
Woojin Know: bit.ly/2CSmksh
ML Gitbooks Edit: bit.ly/2HksKBZ
ML Gitbooks: https://bit.ly/2HpHlbi
iOS Virtual Beacon: pntbiz.dothome.co.kr
Android Guide: https://bit.ly/2MH6SzY
Reinforcement Learning Cheatsheet: http://bit.ly/2KQSdE6
Reinforcement Learning: An Introduction 2nd: http://bit.ly/2wVHn6V
ML Kevin Murphy: http://bit.ly/2NvrvCl
Github Web: https://linked0.github.io/web/, http://bit.ly/2wUbXic
Know Backup: http://bit.ly/2Mfdzrk

#########################################
### Blockchain ###
Hyperledger Readthedocs: http://bit.ly/2CUQTgS
IBM Hyperledger Composer: https://bit.ly/2PSqLF8
IBM Composer Article: ibm.co/2Doj8F4

PnT Blockchain: http://bit.ly/2MfVxoU
Hashing Test: http://bit.ly/2N0Izk7
Generating Bitcoin Address: https://bitaddress.org
Litecoin Github:  http://bit.ly/2N3LEQM
Bitcoin Github: https://github.com/bitcoin/bitcoin
BlockCypher Block Explorer(Testnet): http://bit.ly/2Qeryky
Bitcoin Wiki, APIs: http://bit.ly/2oQ9il3
Test Bitcoin Command: https://bit.ly/2wvlZp1

#### Blockchain Tools used in Udacity Blockchain
Postman, Test Web API: https://www.getpostman.com/
ASCII to text converter: www.unit-conversion.info/texttools/ascii/
Hex encode: www.convertstring.com/EncodeDecode/HexEncode
Base64 Encode: https://www.base64encode.org
Poex.io Demo: http://poex.io/
Blockchain Explorer: https://www.blockchain.com/explorer

#########################################
### ML/Data Science ###
Data is Beautiful: https://www.reddit.com/r/dataisbeautiful/
Kaggle:https://www.kaggle.com/datasets
The Pudding:https://pudding.cool/
FiveThirtyEight:https://fivethirtyeight.com/
Towards Data Science:https://towardsdatascience.com/

#########################################
### Tools ###
Exercise: http://bit.ly/2NZEmda
Site Clunch: http://bit.ly/2wVdqUD
Game Software: http://bit.ly/2oUEAHC
http://regexr.com/
http://jsonviewer.stack.hu/
Json Viewer: http://rextester.com/
Web/JavaScript Test: https://bit.ly/2I3kiTr
Algorithms : http://bit.ly/2MelG7v
Colab Welcome: http://bit.ly/2uhAPOG
Colab play.ipynb: http://bit.ly/2L6tk4p
RBG Color Picker: http://bit.ly/2QgVP24
Kubernets cheat sheet: http://kubernetes.io/docs/user-guide/kubectl-cheatsheet/



