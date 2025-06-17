param(
    [string]$Folder = "."   # 확인할 폴더 경로. 기본은 현재 디렉토리
)

# 콘솔·클립보드 출력을 UTF8로 통일
[Console]::OutputEncoding = [Text.Encoding]::UTF8

# 제외할 확장자 목록
$ExcludedExtensions = @("svg","png","jpg","jpeg","gif","mp4","mov","webp","ico","mp3","wav","exe","zip","tar","gz")

# 파라미터로 받은 폴더를 절대경로로 변환
try {
    $StartDir = (Resolve-Path -Path $Folder).Path
} catch {
    Write-Error "유효하지 않은 경로: $Folder"
    exit 1
}

$Output = ""

# 지정된 폴더 기준 모든 파일 검색
Get-ChildItem -Path $StartDir -Recurse -File | ForEach-Object {
    $File = $_.FullName
    $RelativePath = $File.Substring($StartDir.Length).TrimStart('\','/')
    $Extension = $_.Extension.TrimStart('.').ToLower()

    if ($ExcludedExtensions -contains $Extension) {
        return
    }

    try {
        $Output += "// $RelativePath`r`n"
        $Output += "-----------------------`r`n"
        # 여기서 -Encoding UTF8 으로 읽어옴
        $Output += Get-Content $File -Raw -Encoding UTF8
        $Output += "`r`n`r`n"
    } catch {
        $Output += "// $RelativePath (읽기 실패)`r`n`r`n"
    }
}

# 클립보드로 복사 (UTF8 유지)
Set-Clipboard -Value $Output

Write-Host "Copy to Clipboard: $StartDir `n"
