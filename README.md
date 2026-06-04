# QR Marker AR for OBJ Models

이 프로젝트는 **접속 QR 1개 + 앵커 QR 1개**를 사용하는 수업용 WebAR 예제입니다.

- `qr/access-url.png`: 학생이 모바일 기본 카메라로 먼저 찍는 접속용 QR
- `qr/anchor-target.png`: AR 페이지 안에서 3D 모델이 고정될 위치 기준 QR
- `targets/anchor.mind`: `anchor-target.png`를 MindAR 이미지 타깃으로 컴파일한 파일
- `assets/models/model.obj`, `assets/models/model.mtl`: 표시할 3D 모델

## 사용 순서

1. GitHub 저장소 루트에 이 폴더 안의 파일 전체를 업로드합니다.
2. GitHub Pages를 `main` branch, `/root`로 켭니다.
3. 학생은 `qr/access-url.png`를 모바일 카메라로 찍어 `ar.html`을 엽니다.
4. 카메라 권한을 허용합니다.
5. `qr/anchor-target.png`를 카메라 화면에 비추면 그 위에 3D 모델이 뜹니다.

## 내 OBJ 파일로 교체하기

`assets/models/` 폴더에서 아래 파일을 교체하세요.

```text
assets/models/model.obj
assets/models/model.mtl
```

OBJ가 텍스처 이미지를 사용하면 텍스처 파일도 같은 폴더에 올리고, `.mtl` 안의 `map_Kd` 경로가 맞는지 확인하세요.

모델 크기나 방향이 맞지 않으면 `ar.html`의 이 부분을 수정합니다.

```html
<a-obj-model id="arModel"
  position="0 0 0.16"
  rotation="0 0 0"
  scale="0.9 0.9 0.9">
</a-obj-model>
```

- 너무 크면 `scale="0.3 0.3 0.3"`
- 너무 작으면 `scale="2 2 2"`
- 눕거나 뒤집혀 있으면 `rotation="90 0 0"`, `rotation="-90 0 0"` 등을 시도하세요.

## 앵커 QR을 바꾸고 싶은 경우

앵커 QR 이미지를 바꾸면 반드시 `targets/anchor.mind`도 새로 만들어야 합니다. MindAR는 이미지를 미리 분석해서 `.mind` 파일로 저장한 뒤, 웹페이지에서 그 파일을 불러와 추적합니다.

방법:

1. 새 앵커 이미지 또는 QR을 준비합니다.
2. MindAR Image Targets Compiler에 이미지를 넣고 컴파일합니다.
3. 다운로드한 `.mind` 파일 이름을 `anchor.mind`로 바꿔 `targets/anchor.mind`에 덮어씁니다.
4. 새 이미지도 `qr/anchor-target.png`에 덮어씁니다.

## 조작

- 한 손가락 드래그: 모델 회전
- 두 손가락 핀치: 확대/축소

## 주의

접속 QR과 앵커 QR은 역할이 다릅니다. 접속 QR은 URL을 여는 QR이고, 앵커 QR은 AR 페이지가 추적하는 이미지 타깃입니다.
