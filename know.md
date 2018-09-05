### 명령어 기억
1. Command
find . -iname mainview*
touch -t "201610041200" timestamp
find . -type f -newer timestamp
egrep -ilrnH --include=*.java ‘beacon.pntbiz.com’ ./
sudo xcode-select -s /Applications/XCode7.2/Xcode.app/    #이건 커맨드라인에서 먹는 XCode
To clear the terminal manually: ⌘+K
ps aux | grep chrome
파일 전송
받기: scp carnd@54.249.240.135:/home/abc/index.html ./
올리기: scp ./index.html carnd@54.249.240.135:/home/abc/index.html
폴더 압축
tar --exclude=’./BLE/.git’ -cvzf output_filename.tar.gz folder_name --exclude=’./BLE/.git’
tar -xvzf xxx.tar.gz
zip 풀기
sudo apt-get install unzip
unzip file.zip -d destination_folder
echo 'export PATH=/usr/local/bin:$PATH' >> ~/.bash_profile
구글 드라이브에 파일 업로드(https://github.com/prasmussen/gdrive)
poohex id: 0B6E3rj3qrE6NMTRxYU41T1REXzQ
맥 설치
brew install gdrive
리눅스 설치
cd~
wget “https://docs.google.com/uc?id=0B3X9GlR6EmbnWksyTEtCM0VfaFE&export=download”
mv “uc?id=0B3X9GlR6EmbnWksyTEtCM0VfaFE&export=download” gdrive
chmod +x gdrive
sudo install gdrive /usr/local/bin/gdrive
gdrive list
gdrive upload --parent 1u7Gdc1ieGpNYl8trq2RG84wBAKjVk61P eng-math.pdf (poohfiles에 올리기)
gdrive download 1pI3oIlne8U--qBmTny0mBvahaiQWVdoY (파일 가져오기, 공유 링크에서 id를 보면 됨)
다른 pc에서 작업한 것이면 .gdrive 지우고, 브라우저에서 계정정보 지우기
Homebrew: ruby -e "$(curl -fsSL https://bit.ly/1LEgSWs)"
AWS: EC Home -> Launch Instance(파란색버튼) -> Community AMIS에서 CoreOS로 검색 -> PV 선택
google drive에서 jaylee.per 검색 -> chmod 400 jaylee.pem 
ssh -i ./jaylee.pem core@54.199.65.181 ← CoreOS 인스턴스
ssh -i jaylee.pem ubuntu@52.192.176.112 ← Ubuntu 인스턴스
sudo useradd -m linked0 -> sudo passwd linked0
AWS 설치 관련 Python Microservice Development 문서
brew/nvm
brew upgrade node
nvm으로 node(nodejs)지우기: nvm uninstall v8.10.0
화면 일부만 선택하여 스크린샷을 찍는 방법
shift-command-4 키를 누릅니다. …
Go
godoc fmt Printf
godoc cmd/fmt
godoc -http=:8001
go build aSourceFile.go
file aSourceFile
go run aSourceFile.go ← 빌드와 실행까지
go get -v github.com/mactsouk/go/simpleGitHub
소스
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
푸시 제거 삭제: git reset —soft HEAD^ (커밋하고 푸시까지 된 것 한개만 제거)
변경파일 commit에 포함시키기: git add benchmarks.rb
git config --global user.name "linked0"
git config --global user.email linked@gmail.com
git push
sername for 'https://github.com': linked0@gmail.com
Password for 'https://linked0@gmail.com@github.com': 
2. Edit
Visual Studio Code command 실행
shift-cmd-p -> shell command -> terminal에서 code로 실행
mac vim
brew install macvim --override-system-vim
xcode-select install
sudo xcode-select --switch /Library/Developer/CommandLineTools
find ./ -type f > files
open -a macvim files
<ctl-w>f: open in a new window
<ctl-w>gf: open in a new tab
<c-w> {H,J,K,L}: move among windows
3. python
import requests
res = requests.get('https://api.github.com/some/endpoint', headers={'user-agent': 'my-app/0.0.1'})
res = requests.post('http://redmine.pntbiz.com:13000/projects/indoorplus-lbs-sdk/wiki/IOS_Getting_Started', data = {'username':'hjlee','password':'amadeus0'})
conda create -n autobuild python=3.6
conda create -n py3conda python=3.6 anaconda ⇐ 이게 anaconda를 관련 패키지를 다 설치해준다.
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

4. ML
sudo tensorboard --logdir='my_graph'

5. Android
Toast.makeText(SplashActivity.this, msg, Toast.LENGTH_SHORT).show();
 
6. iOS
Assistant Editor: Opt-Cmd-Ret
