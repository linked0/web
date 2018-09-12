##################################################################
# Sites #
##################################################################
### Work ###
ML Gitbooks Edit: bit.ly/2HksKBZ
ML Gitbooks: https://bit.ly/2HpHlbi
iOS Virtual Beacon: pntbiz.dothome.co.kr
Android Guide: https://bit.ly/2MH6SzY
Reinforcement Learning Cheatsheet: http://bit.ly/2KQSdE6
Reinforcement Learning: An Introduction 2nd: http://bit.ly/2wVHn6V
ML Kevin Murphy: http://bit.ly/2NvrvCl
Github Web: https://linked0.github.io/web/, http://bit.ly/2wUbXic
Know Backup: http://bit.ly/2Mfdzrk

##################################################################
### Blockchain ###
PnT Blockchain 정리:http://bit.ly/2MfVxoU
Hashing Test: http://bit.ly/2N0Izk7
Generating Bitcoin Address: https://bitaddress.org
Litecoin Github:  http://bit.ly/2N3LEQM
Bitcoin Github: https://github.com/bitcoin/bitcoin
BlockCypher Block Explorer(Testnet): http://bit.ly/2Qeryky
Bitcoin Wiki, APIs: http://bit.ly/2oQ9il3
Test Bitcoin Command: https://bit.ly/2wvlZp1

##################################################################
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

##################################################################
# Command
##################################################################
### 1. Command ###
find . -iname mainview*
touch -t "201610041200" timestamp
find . -type f -newer timestamp
egrep -ilrnH --include=*.java ‘beacon.pntbiz.com’ ./

sudo xcode-select -s /Applications/XCode7.2/Xcode.app/
To clear the terminal manually: Cmd + K
ps aux | grep chrome

File Transfer
Download: scp carnd@54.249.240.135:/home/abc/index.html ./
Upload: scp ./index.html carnd@54.249.240.135:/home/abc/index.html

Zip Foler
tar --exclude='./BLE/.git' -cvzf output_filename.tar.gz folder_name --exclude='./BLE/.git'
tar -xvzf xxx.tar.gz

Zip extract
sudo apt-get install unzip
unzip file.zip -d destination_folder

echo 'export PATH=/usr/local/bin:$PATH' >> ~/.bash_profile

File Upload to Google Drive(https://github.com/prasmussen/gdrive)
poohex id: 0B6E3rj3qrE6NMTRxYU41T1REXzQ
Install on Mac
brew install gdrive

Install on Linux
cd~
wget "https://docs.google.com/uc?id=0B3X9GlR6EmbnWksyTEtCM0VfaFE&export=download"
mv "uc?id=0B3X9GlR6EmbnWksyTEtCM0VfaFE&export=download" gdrive
chmod +x gdrive
sudo install gdrive /usr/local/bin/gdrive

gdrive list
gdrive upload --parent 1u7Gdc1ieGpNYl8trq2RG84wBAKjVk61P eng-math.pdf (upload to poohfiles)
gdrive download 1pI3oIlne8U--qBmTny0mBvahaiQWVdoY (Download file, You can find id)

Homebrew: ruby -e "$(curl -fsSL https://bit.ly/1LEgSWs)"
AWS: EC Home -> Launch Instance(Blue Button) -> Select CoreOS on Community AMIS -> Select PV
google drive Search: jaylee.pem -> chmod 400 jaylee.pem 
ssh -i ./jaylee.pem core@54.199.65.181 ← CoreOS Instance
ssh -i jaylee.pem ubuntu@52.192.176.112 ← Ubuntu Instance
sudo useradd -m linked0 -> sudo passwd linked0
AWS Installatio on Python Microservice Development Document

brew/nvm
brew upgrade node
nvm node(nodejs) uninstall: nvm uninstall v8.10.0

Go
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
 
func main() { 
    fmt.Println("Hello there!") 
}

Git
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

##################################################################
### 2. Edit ###
Visual Studio Code command 실행
shift-cmd-p -> shell command -> terminal에서 code로 실행
mac vim
brew install macvim --override-system-vim
xcode-select install
sudo xcode-select --switch /Library/Developer/CommandLineTools
find ./ -type f > files
find . -type file -name '*.js' -o -name '*.json' > files
open -a macvim files
<ctl-w>f: open in a new window
<ctl-w>gf: open in a new tab
<c-w> {H,J,K,L}: move among windows

##################################################################
### 3. python ###
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
#플로팅을 하는 하나의 셀마다 써주는게 좋음. 그래야, 계속 실행시켜도 이전 것이 지워짐.
%matplotlib inline
%config InlineBackend.close_figures=False
%load_ext autoreload			
%autoreload 2
%config InlineBackend.figure_format = 'retina'

##################################################################
### 4. ML ###
sudo tensorboard --logdir='my_graph'

##################################################################
### 5. Cloud ###
gcloud compute zones list
gcloud config set compute/zone <zone>
gcloud compute instances create ubuntu \
gcloud compute ssh ubuntu
 
##################################################################
### 6. Android ###
Toast.makeText(SplashActivity.this, msg, Toast.LENGTH_SHORT).show();

##################################################################
### 7. iOS ###
Assistant Editor: Opt-Cmd-Ret

