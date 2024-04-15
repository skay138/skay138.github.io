---
image: cover/springboot.png
title: Spring 파일 업로드와 다운로드
slug: sping-file-upload-download
description: MultipartFile과 HttpServletRequest를 이용하여 파일을 업로드 및 다운로드 해보자
date: 2024-04-11T08:03:19.544Z
categories: Backend Studies/Spring Boot
---

게시판을 구현하다보면 첨부파일 기능이 필요한 경우가 있습니다. 현재 진행중인 Spring 기반 프로젝트 버전과 맞는 첨부파일 핸들링을 해보며 관련 내용을 정리해보려고 합니다.

## 테이블 구성

게시글 하나당 하나의 첨부파일만 업로드한다면 게시글 테이블 하나로도 구현이 가능하겠지만, 여러개의 첨부파일을 올리고 싶다면 첨부파일 테이블을 따로 구성해야 합니다.\
저는 게시판 테이블의 이름을 HappyBoard라 정하였고, 이에 따라 HappyBoardAtfi라는 첨부파일 관리 테이블을 만들었습니다.\
두 테이블에는 ATGP\_SN(그룹파일번호) 컬럼을 두어 연결을 했습니다.\
\
첨부파일 테이블의 구성은 다음과 같습니다.

* ATGP\_SN : 그룹파일번호
* ATFI\_SN : 첨부파일번호(PK)
* ATFI\_URL : 첨부파일 저장 경로
* ATFI\_SF\_NAME : 첨부파일 저장 이름
* ATFI\_OG\_NAME : 첨부파일 원본 이름
* ATFI\_EXT : 첨부파일 확장자명

## 파일 업로드

```java
public String happyFileUpload(MultipartFile file, String happyAtgpSn) throws Exception {
    String filePath = "happyBoard/atch";

    //확장자명 가져오기
    String fileExt = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf(".") + 1).toLowerCase();
    String fileName = "happy" + "_" + System.nanoTime() + "." + fileExt;

    // 저장할 경로의 파일객체를 생성(transferTo 메서드에 사용)
    File happyFile = new File(filePath + fileName);

    // 원본파일명이 존재하는 경우
    if (!"".equals(file.getOriginalFilename())) {
        happyAtgpSn = "400";
        return happyAtgpSn;
    }
    try {
        // 파일 경로가 없다면 생성
        File chkDir = new File(filePath);

        if (!chkDir.exists()) {
            chkDir.mkdirs();
        }

        // 임시 파일 저장 경로로 이동(서버에 저장)
        file.transferTo(happyFile);

        // 파일 정보 객체에 저장
        HappyBoardAtfiVO happyBoardAtfiVO = new HappyBoardAtfiVO();
        happyBoardAtfiVO.setHappyAtgpSn(happyAtgpSn);                // 첨부파일 그룹 일련번호
        happyBoardAtfiVO.setHappyAtfiOgName(file.getOriginalFilename());    // 첨부파일 원본명
        happyBoardAtfiVO.setHappyAtfiSfName(fileName);                       // 첨부파일 저장명
        happyBoardAtfiVO.setHappyAtfiExt(fileExt);                               // 첨부파일 확장자명
        happyBoardAtfiVO.setHappyAtfiUrl(filePath);                            // 첨부파일 저장 경로

        // 첨부파일 정보 DB에 등록
        happyAtgpSn = mypageService.insertHappyAtfiInfo(happyBoardAtfiVO);

    } catch (NullPointerException np) {
        np.printStackTrace();
        happyFile.delete();
        happyAtgpSn = "400";
    } catch (IOException ie) {
        ie.printStackTrace();
        happyFile.delete();
        happyAtgpSn = "400";
    } catch (Exception e) {
        e.printStackTrace();
        happyFile.delete();
        happyAtgpSn = "400";
    }

    return happyAtgpSn;
}
```

위 메서드가 정상적으로 종료되어 happyAtgpSn을 return한다면 서버에 첨부파일이 저장되고, 첨부파일 테이블에도 관련 정보가 저장됩니다. 이후 happyAtgpSn을 게시글 데이터에 추가하여 게시글 테이블에 해당 게시글을 등록합니다(코드는 생략).

### 다른 방법

```java
public String happyFileUpload(MultipartFile file, String happyAtgpSn) throws Exception {
    String filePath = "happyBoard/atch/";
    String fileExt = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf(".") + 1).toLowerCase();
    String fileName = "happy" + "_" + System.nanoTime() + "." + fileExt;
    Path happyFilePath = Paths.get(filePath, fileName);
    // 원본파일명이 없으면 패스
    if (file.getOriginalFilename().equals("")) {
        happyAtgpSn = "400";
        return happyAtgpSn;
    }
    try {
        //폴더 경로가 없다면 생성
        File chkDir = new File(filePath);

        if (!chkDir.exists()) {
            chkDir.mkdirs();
        }

        //파일 전송
        try (InputStream inputStream = file.getInputStream()){
            Files.copy(inputStream, happyFilePath, StandardCopyOption.REPLACE_EXISTING);
            inputStream.close();

            HappyBoardAtfiVO happyBoardAtfiVO = new HappyBoardAtfiVO();
            happyBoardAtfiVO.setHappyAtgpSn(happyAtgpSn);                // 첨부파일 그룹 일련번호
            happyBoardAtfiVO.setHappyAtfiOgName(file.getOriginalFilename());    // 첨부파일 원본명
            happyBoardAtfiVO.setHappyAtfiSfName(fileName);                       // 첨부파일 저장명
            happyBoardAtfiVO.setHappyAtfiExt(fileExt);                               // 첨부파일 확장자명
            happyBoardAtfiVO.setHappyAtfiUrl(filePath);                            // 첨부파일 저장 경로
            // 첨부파일 정보 등록
            happyAtgpSn = mypageService.insertHappyAtfiInfo(happyBoardAtfiVO);
        }

    } catch (NullPointerException np) {
        np.printStackTrace();
        happyAtgpSn = "400";
    } catch (IOException ie) {
        ie.printStackTrace();
        happyAtgpSn = "400";
    } catch (Exception e) {
        e.printStackTrace();
        happyAtgpSn = "400";
    }

    return happyAtgpSn;
}
```

java의 NIO 패키지를 이용하여 업로드 기능을 구현할 수도 있습니다.\
`Files.copy()`에서 CopyOption을 설정할 수 있습니다.

## 파일 다운로드

> 기본적인 파일 다운로드

```java
public void happyFileDownload(HttpServletRequest request, HttpServletResponse response) throws Exception {
    String happyAtfiSn = request.getParameter("happyAtfiSn");
    String happyAtgpSn = request.getParameter("happyAtgpSn");
    String happyAtfiOgName = request.getParameter("happyAtfiOgName");
    String happyAtfiSfName = request.getParameter("happyAtfiSfName");

    if (happyAtfiSfName != null) {
        String filePath = "happyBoard/atch/";
        Path file = Paths.get(filePath, happyAtfiSfName);

        if (Files.exists(file) && Files.isRegularFile(file)) {
            String browser = request.getHeader("User-Agent");
            String encodedFileName = "";

            // 파일 인코딩
            if (browser.contains("MSIE") || browser.contains("Trident") || browser.contains("Chrome")) { 
                // 브라우저 확인 파일명
                encodedFileName = URLEncoder.encode(happyAtfiOgName, "UTF-8").replaceAll("\\+", "%20").replace("+", "%20");
            } else {
                encodedFileName = new String(happyAtfiOgName.getBytes("UTF-8"), "ISO-8859-1");
            }

            response.setHeader("Content-Disposition", "attachment;filename=" + encodedFileName);
            response.setContentType("application/octet-stream");

            Files.copy(file, response.getOutputStream());
        }
    }

}
```

NIO 패키지를 이용하여 파일 다운로드 기능을 구현할 수 있습니다.

`참고:`Spring에서 제공하는 `StreamingResponseBody`를 활용하여 다운로드를 구현할 수도 있습니다.

`참고:`web의 파일다운로드는 링크 클릭이나 폼 제출을 통해 다운로드해야 합니다.\
Ajax등을 이용할 경우 payload가 제대로 전달되지 않을 수 있어요.

> 대용량 파일 다운로드의 경우에는 주로 `스트리밍 방식`과 `URL 제공 방식`을 사용합니다.

1. 스트리밍 방식 : 데이터를 outputStream에 담아 전송
2. URL 제공 방식 : 파일이 저장되어 있는 경로를 제공하여 브라우저에서 다운로드

### 스트리밍 방식

```java
@RequestMapping("")
public void happyFileDownload(HttpServletRequest request, HttpServletResponse response) throws Exception {
    String happyAtfiSn = request.getParameter("happyAtfiSn");
    String happyAtgpSn = request.getParameter("happyAtgpSn");
    String happyAtfiOgName = request.getParameter("happyAtfiOgName");
    String happyAtfiSfName = request.getParameter("happyAtfiSfName");

    if (happyAtfiSfName == null) {
        return;
    }
    String filePath = "happyBoard/atch/";
    Path file = Paths.get(filePath, happyAtfiSfName);

    if (!Files.exists(file) || !Files.isRegularFile(file)) {
        return;
    }
    String browser = request.getHeader("User-Agent");
    String encodedFileName = "";

    // 파일 인코딩
    if (browser.contains("MSIE") || browser.contains("Trident") || browser.contains("Chrome")) {
        // 브라우저 확인 파일명
        encodedFileName = URLEncoder.encode(happyAtfiOgName, "UTF-8").replaceAll("\\+", "%20").replace("+", "%20");
    } else {
        encodedFileName = new String(happyAtfiOgName.getBytes("UTF-8"), "ISO-8859-1");
    }

    response.setHeader("Content-Disposition", "attachment;filename=" + encodedFileName);
    response.setContentType("application/octet-stream");

    try (InputStream in = Files.newInputStream(file)) {
        byte[] buffer = new byte[4096]; // 버퍼 크기 설정
        int bytesRead;
        while ((bytesRead = in.read(buffer)) != -1) {
            response.getOutputStream().write(buffer, 0, bytesRead);
        }
    } catch (NullPointerException np) {
        np.printStackTrace();
    } catch (IOException ie) {
        ie.printStackTrace();
    } catch (Exception e) {
        e.printStackTrace();
    }

}
```

***

```java
fis = new FileInputStream(file);
bis = new BufferedInputStream(fis);
so = response.getOutputStream();
bos = new BufferedOutputStream(so);

byte[] data = new byte[2048];
int input = 0;
while ((input = bis.read(data)) != -1) {
    bos.write(data, 0, input);
    bos.flush();
}
```

InputStream과 OutputStream은 위처럼 구현할 수도 있습니다.

1. `FileInputStream`: 이 클래스는 파일로부터 바이트 단위로 데이터를 읽어오는데 사용됩니다. 파일을 열고 그 내용을 읽어들일 때 주로 활용됩니다.
2. `BufferedInputStream`: 이 클래스는 데이터를 읽어올 때 성능을 향상시키기 위해 사용됩니다. FileInputStream과 같이 사용되며, 데이터를 버퍼에 저장해두고 필요할 때 버퍼로부터 읽어오는 방식으로 동작합니다. 이는 입출력 작업을 보다 효율적으로 수행할 수 있도록 도와줍니다.
3. `ServletOutputStream`: 이 클래스는 서블릿에서 클라이언트로 데이터를 보낼 때 사용됩니다. 서블릿 컨테이너에서 제공되며, HTTP 응답의 출력 스트림을 나타냅니다. 클라이언트로 데이터를 보내기 위해 사용됩니다.
4. `BufferedOutputStream`: 이 클래스는 데이터를 쓸 때 성능을 향상시키기 위해 사용됩니다. ServletOutputStream과 같이 사용되며, 데이터를 버퍼에 저장해두고 필요할 때 버퍼의 내용을 출력하는 방식으로 동작합니다. 이는 입출력 작업을 보다 효율적으로 수행할 수 있도록 도와줍니다.

이렇게 설정된 스트림들은 파일의 내용을 읽어들여 클라이언트에게 전송하는 데 사용됩니다. `FileInputStream`과 `BufferedInputStream`은 파일에서 데이터를 읽어오고, `ServletOutputStream`과 `BufferedOutputStream`은 클라이언트로 데이터를 전송합니다.

### URL 제공 방식

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/files/**")
                .addResourceLocations("file:/path/to/directory/");
    }
}
```

파일 리소스의 경로와 URL 경로를 맵핑하여 브라우저에게 다운로드를 제공할 수 있습니다.

## 파일 삭제

```java
public int happyFileDel(String happyAtfiSfName, String happyAtfiSn) throws Exception {
    int code = 400;
  try {

        String filePath = "happyBoard/atch";

        File happyFile = new File(filePath + happyAtfiSfName);

        // 첨부파일 삭제
        boolean progress = happyFile.delete();

    if (progress) {
      // 첨부파일 정보 삭제
      mypageService.happyAtfiDelete(happyAtfiSn);

      code = 200;
    }

  } catch (NullPointerException np) {
    np.printStackTrace();
    code = 400;
    return code;
  } catch (IOException ie) {
    ie.printStackTrace();
    code = 400;
    return code;
  } catch (Exception e) {
    e.printStackTrace();
    code = 400;
    return code;
  }
  return code;
}
```

파일 삭제의 경우, 서버에 올라간 파일을 삭제 후 DB테이블의 파일도 삭제를 해주셔야 합니다.\
해당 메서드를 파일삭제, 게시글 삭제 등 적절한 요청에 붙여서 사용했습니다.
