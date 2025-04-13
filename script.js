// 특징 목록
const eyeColors = ["파란색", "녹색", "갈색", "검은색"];
const skinColors = ["흰색", "검은색", "갈색"];
const geneticDisorders = ["없음", "다운 증후군", "터너증후군", "클라인펠터증후군"];

// 용의자 데이터 초기화
const suspects = [
    { name: "루나", eyeColor: "", skinColor: "", geneticDisorder: "" },
    { name: "엘라", eyeColor: "", skinColor: "", geneticDisorder: "" },
    { name: "올리비아", eyeColor: "", skinColor: "", geneticDisorder: "" },
    { name: "올리버", eyeColor: "", skinColor: "", geneticDisorder: "" },
    { name: "레오", eyeColor: "", skinColor: "", geneticDisorder: "" },
    { name: "노아", eyeColor: "", skinColor: "", geneticDisorder: "" }
];

// 용의자 특징 랜덤 설정 함수
function assignRandomFeatures() {
    const assignedEyeColors = [];
    const assignedSkinColors = [];

    function getRandomUniqueFeatures(array, count) {
        const shuffled = shuffleArray(array);
        return shuffled.slice(0, count);
    }

    assignedEyeColors.push(...getRandomUniqueFeatures(eyeColors, 3));
    assignedSkinColors.push(...getRandomUniqueFeatures(skinColors, 2));

    // 기본 특징 부여
    suspects.forEach((suspect, index) => {
        suspect.eyeColor = assignedEyeColors[index % assignedEyeColors.length];
        suspect.skinColor = assignedSkinColors[index % assignedSkinColors.length];
        suspect.geneticDisorder = "없음"; // 기본 유전병 설정
    });

    // 랜덤으로 터너증후군 부여
    const turnerCandidates = ["루나", "엘라", "올리비아"];
    const selectedTurner = shuffleArray(turnerCandidates).slice(0, 2);
    selectedTurner.forEach(name => {
        const suspect = suspects.find(s => s.name === name);
        suspect.geneticDisorder = "터너증후군";
    });

    // 랜덤으로 클라인펠터증후군 부여
    const kleinCandidates = ["올리버", "레오", "노아"];
    const selectedKlein = shuffleArray(kleinCandidates).slice(0, 2);
    selectedKlein.forEach(name => {
        const suspect = suspects.find(s => s.name === name);
        suspect.geneticDisorder = "클라인펠터증후군";
    });
}

// 용의자 중 범인 랜덤 선정
let killer;

// 조사 가능한 장소
const locations = ["마당", "거실", "부엌", "화장실", "에바의 방", "부모님의 방", "차고", "서재"];

// 클루 할당을 위한 변수
let clueLocations = {};
let searchedLocations = 0;
let cluesFound = [];

// 클루 모달
const clueModal = document.getElementById('clueModal');
const closeClueModal = document.getElementById('closeClueModal');
const analyzeButton = document.getElementById('analyzeButton');

closeClueModal.onclick = function() {
    clueModal.style.display = "none";
}

analyzeButton.onclick = function() {
    const clue = cluesFound.pop();
    alert(`${clue.type}: ${clue.value}`);
    clueModal.style.display = "none";
}

// 성공 모달
const successModal = document.getElementById('successModal');
const closeSuccessModal = document.getElementById('closeSuccessModal');
const restartButton = document.getElementById('restartButton');
const exitButton = document.getElementById('exitButton');

closeSuccessModal.onclick = function() {
    successModal.style.display = "none";
}

restartButton.onclick = function() {
    resetGame();
}

exitButton.onclick = function() {
    window.close();
}

// 실패 모달
const failureModal = document.getElementById('failureModal');
const closeFailureModal = document.getElementById('closeFailureModal');
const restartButtonFail = document.getElementById('restartButtonFail');
const exitButtonFail = document.getElementById('exitButtonFail');

closeFailureModal.onclick = function() {
    failureModal.style.display = "none";
}

restartButtonFail.onclick = function() {
    resetGame();
}

exitButtonFail.onclick = function() {
    window.close();
}

// 게임 초기화
function initializeGame() {
    assignRandomFeatures(); // 특징 랜덤 설정
    killer = suspects[Math.floor(Math.random() * suspects.length)]; // 범인 랜덤 선정
    let clueTypes = ["eyeColor", "skinColor", "geneticDisorder"];
    let selectedLocations = shuffleArray(locations).slice(0, 3);
    selectedLocations.forEach((loc, index) => {
        clueLocations[loc] = {
            type: clueTypes[index],
            value: killer[clueTypes[index]]
        }
    });
}

// 배열 섞기 함수
function shuffleArray(array) {
    let arr = array.slice();
    for(let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// 위치 버튼 클릭 이벤트
const locationButtons = document.querySelectorAll('.location-button');
locationButtons.forEach(button => {
    button.addEventListener('click', function() {
        const location = this.getAttribute('data-location');
        this.disabled = true;
        searchedLocations++;
        if (clueLocations[location]) {
            cluesFound.push(clueLocations[location]);
            clueModal.style.display = "block";
        } else {
            alert("단서를 찾지 못했습니다.");
        }

        if (searchedLocations === 5) {
            document.getElementById('identifyButton').disabled = false;
            locationButtons.forEach(btn => btn.disabled = true);
        }
    });
});

// 범인 지목 버튼
const identifyButton = document.getElementById('identifyButton');
let attempts = 2;

let attemptedSuspects = []; // 이미 지목했던 용의자 저장

identifyButton.addEventListener('click', function() {
    let cluesSummary = cluesFound.map(clue => `${clue.type}: ${clue.value}`).join('\n');
    let suspectDescriptions = suspects.map(suspect => 
        `${suspect.name} - eyeColor: ${suspect.eyeColor}, skinColor: ${suspect.skinColor}, geneticDisorder: ${suspect.geneticDisorder}`
    ).join('\n');

    let suspectName = prompt(`범인을 지목하세요:\n${suspectDescriptions}`);

    let selectedSuspect = null;
    switch(suspectName) {
        case "루나":
            selectedSuspect = suspects[0];
            break;
        case "엘라":
            selectedSuspect = suspects[1];
            break;
        case "올리비아":
            selectedSuspect = suspects[2];
            break;
        case "올리버":
            selectedSuspect = suspects[3];
            break;
        case "레오":
            selectedSuspect = suspects[4];
            break;
        case "노아":
            selectedSuspect = suspects[5];
            break;
        default:
            alert("용의자의 이름을 정확하게 기입하세요.");
            return;
    }
    
    // 지목했던 용의자 체크
    if (attemptedSuspects.includes(selectedSuspect.name)) {
        alert('이미 지목한 용의자입니다.');
        return;
    }

    // 지목한 용의자 추가
    attemptedSuspects.push(selectedSuspect.name); 

    if (selectedSuspect === killer) {
        successModal.style.display = "block";
        identifyButton.disabled = true;
    } else {
        attempts--;
        if (attempts > 0) {
            alert(`범인이 아닙니다! 남은 기회: ${attempts}`);
        } else {
            // 범인 검거 실패 시 범인 이름 표시
            alert(`범인 검거 실패! 범인은 ${killer.name}입니다.`);
            failureModal.style.display = "block";
            identifyButton.disabled = true;
        }
    }
});

// 게임 시작 시 초기화
initializeGame();

// 창을 클릭하면 모달 닫힘
window.onclick = function(event) {
    if (event.target == clueModal) {
        clueModal.style.display = "none";
    }
    if (event.target == successModal) {
        successModal.style.display = "none";
    }
    if (event.target == failureModal) {
        failureModal.style.display = "none";
    }
};

// 게임 리셋
function resetGame() {
    location.reload();
}
