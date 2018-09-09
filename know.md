# 프로젝트 관리

### 1. PM
* 기획
- 애자일 업무 방식: 개발을 완성하고 제품을 내놓는 게 아니라 개발하는 과정에서 고객들에게 보여주고 끊임없이 피드백을 받아 수정
* UI 플로우 설계, 기술 분석, 위험 분석
- Google 문서로 공유, 메인 작업자가 있고 댓글 기능으로 협업
- 위험 분석은 상상력이 필요한 부분
- 필요 문서: UI 시나리오, 기술 설계서
* 프로토타이핑
- 기본 앱의 틀이 마련되어 있어야 함. (Android Studio의 갤러리에서 선택)
* UI Design
- 하나의 보편 단말을 기준으로 pixel값을 정의 하고, 그것에 맞게 dpi가 정해진 디자인 가이드 문서가 필요하다.
- 이미지는 HDPI:240dpi, XHDPI:320dpi, XXHDPI:480dpi, XXXHDPI:640dpi중에서 고해상도와 저해상도 하나씩 있으면 될 것으로 보임.
 -- 가장 기본이 되는 XXXHDPI를 기준으로 작업하면 안드로이드가 알아서 줄여준다.
 -- 저해상도, 중해상도, 고해상도 이미지를 따로 가지는게 좋다.(참고: http://leipiel.tistory.com/7)
* 일정 산정
- WBS 과정 필요
- UI 디자인 및 조정
* 개발
- 중요 내용부터 1차로 개발 진행하고 UI 가이드 및 시나리오를 수정하고 다시 개발 진행
- 내용이 큰 수정에 대해서 브랜치를 따서 작업한다. (브랜치를 따서 개발을 진행하면 이력이 묶이는 효과가 있다.)
- 기본 라이브러리는 가지고 있어야 함.
- 나머지 중요한 사항은 코딩 패턴 참고
- 개발은 반복적으로(iterative): 일차로 커메라가 되고, 포커스 잡고, 셔터음이 들리는 등→ 프리뷰의 사이즈 고민하는 등
* 검증
* 빌드
- 개발용 PC와 빌드용 PC는 따로 가지고 있는 것이 좋다(신라 m2빌드시)
* 지속적인 업데이트/문서관리/이슈관리
- 이슈관리: 깃헙, 레드마인, 만티스
- 문서관리
- 지속적으로 업데이트
- 항상 말도 안되는 것이라도 위험요소를 파악해야함.

### 2. 개발 & 코딩 패턴
* Principles of work
- 항상 토스트로 띄우자.
- UnitTest는 매주 중요 - DLND Gradient 구현 경험을 살리자.
- 안드로이드 앱 개발시에 항상 https://developer.android.com/guide/부터 들러서 확인, 글로벌 SaaS Camera Activity 개발시 알게된 것
- 그냥 외우는 것보다 이해를 하면 쉬워진다. 그게 어렵다. (Confusion Matrix)
- google colab에서 !echo "hello" >> README 쓰면 됨.

* 모든 public 함수에는 다음의 코멘트를 추가한다.
/**
* 해당 id의 비컨을 Presence map에 추가한다.
* @param id 추가할 비컨의 id(UUID_MAJOR_MINOR)
* @param x 추가할 비컨의 위도
* @param y 추가할 비컨의 경도
* @param rssi_weight 추가할 비컨의 경도
* @return 추가된 비컨의 id
*/

* 디버깅코드는 라인수까지 나타나도록 한다.
- 이유: 디버깅시에 해당 함수를 콜한 위치를 알면 시간이 단축된다. 
- 예시: 문과장 코드 확인 필요
* 중복되는 코드가 없도록 한다.
- 이유: 중복되는 코드가 있으면 하나가 바뀌면 모두 바뀌어야 한다. 그러나가 하나로 놓치면 오동작 상황이 발생한다.
- 예시: iOS setAgreement 통신 코드
* 불필요한 코드는 없도록 한다.
- 이유: 코드 분석이나 나중에 수정시 혼란을 초래한다. 
- 예시: iOS setAgreement 통신 코드
* 상속시 코드는 공통코드만 Parent에 놓고 나머지는 Child에 놓는다.
- 추가적으로 static 함수를 Parent에 놓는다.
* 절대 데이터 없이 함수만 존재하는 클래스는 만들지 말아야 한다. 만들어야 한다면 Util클래스 정도
- 이유는 어떤 데이터에 대해서 flow가 이미 클래스로 존재하는데 또 다른 플로우가 존재하면서 코드가 불분명해진다.
* 공통적으로 나오는 스크링은 static 변수로 만든다.
- PMD 돌리면 “Avoid Duplicate Literals” 에러 떨어짐
* if 안에, else없이 중복되는 if를 쓰지 마라.
- PMD 돌리면 “Collapsible If Statements” 에러 떨어짐
* throws Exception와 catch (Exception e) 중에 하나만 써라
- PMD 돌리면 “Signature Declare Throws Exception” 에러 떨어짐
* instanceof 연산자를 사용할 경우, null 체크할 필요 없음
- if (context != null & context instanceof Activity)
- PMD에서 Simplify Conditional 에러 떨어짐
* interface 선언내의 함수에 public붙이지 마라.
* 생성자에서 Override 함수를 호출하지 마라.
- Overridable method called during object construction PMD 에러 발생
* Android Layout 원칙
- 각각의 연속되는 뷰는 마진에 대해서 나눠가는게 좋다.
- 키노트로 대략의 레이아웃을 그리는게 좋다(어떤 좋은 툴이 있을까?)
- layout_height는 wrap_content가 최고다. layout_weight는 주는 것이 좋다.

### 3. 툴의 사용
이슈 트래킹: Redmin
형상관리: Github, 이슈 관리도 가능, Mantis도 필요없음
이슈 공유: Trello, 일정공유가 좋음, slakc은 후보
문서/파일 공유: Google Drive
UML/디자인툴: Draw.io
API 문서: ReadTheDocs, Gitbook
앱 공유: Dothome
Character/Object Modeling : Blender

### 4. 업무 주도성
* 회의시간에 무엇을 논의할 것인가? 어떻게 전달할 것인가? 결과를 어떻게 책임질 것인가? 생각 못하는 부분은 없는가?
 - 중요한 것은 나의 논리의 무결성이 아니라 올바른 방향으로 나아가는 것.

# 명령어 

### 1. Command
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

### 2. Edit
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

### 3. python
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

### 4. ML
sudo tensorboard --logdir='my_graph'

### 5. Android
Toast.makeText(SplashActivity.this, msg, Toast.LENGTH_SHORT).show();
 
### 6. iOS
Assistant Editor: Opt-Cmd-Ret
