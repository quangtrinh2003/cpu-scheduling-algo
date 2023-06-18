const form = document.querySelector('form');
const ul = document.querySelector('ul');
const li = document.createElement('li');
const label = document.createElement('label');
const input = document.createElement('input');
const appendRemoveRow = ul.querySelector('#append-remove-row');
const appendButton = appendRemoveRow.querySelector('.append');
const removeButton = appendRemoveRow.querySelector('.remove');
const quantumInput = document.querySelector('#quantum-input');
const algorithms = document.querySelector('#algorithms');
const divFormHolder = document.querySelector('#input-form');
const inputArray = [];
let liNodeClone;
let labelNodeClone;
let inputNodeClone;
let numberOfNode;
let arrayLength;
let quantum;

li.classList.add('box');
input.setAttribute('type', 'number');
input.classList.add('process');

form.addEventListener('submit', inputProcess);

function appendRow()
{
    event.preventDefault();
    numberOfNode = ul.querySelectorAll('.box').length;
    liNodeClone = li.cloneNode();
    labelNodeClone = label.cloneNode();
    inputNodeClone = input.cloneNode();

    inputNodeClone.setAttribute("id", `arrive`);
    inputNodeClone.setAttribute("name", `P${numberOfNode+1}`);
    labelNodeClone.textContent = `P${numberOfNode + 1}:`;
    inputNodeClone.required = true;
    liNodeClone.append(labelNodeClone, inputNodeClone);

    inputNodeClone = input.cloneNode();
    inputNodeClone.setAttribute("id", `bursttime`);
    inputNodeClone.setAttribute("name", `P${numberOfNode+1}`);
    inputNodeClone.required = true;
    liNodeClone.appendChild(inputNodeClone)

    ul.insertBefore(liNodeClone, quantumInput);

    if(ul.querySelectorAll('.box').length > 1)
    {
        removeButton.style.visibility = 'visible';
    }
}

function removeRow()
{
    event.preventDefault();
    ul.removeChild(quantumInput.previousElementSibling)

    if(ul.querySelectorAll('.box').length === 1)
    {
        removeButton.style.visibility = 'hidden';
    }
}

function Process(process, arrive, burstTime)
{
    this.process = process;
    this.arrive = arrive;
    this["burst time"] = burstTime;
}

function inputProcess(event)
{
    removeButton.style.visibility = 'hidden';
    let isFormValidFailed = false
    const input = document.querySelectorAll('.process');
    const inputQuantum = quantumInput.querySelector('#quantum').value;
    
    input.forEach((e) => {
        if((e.id === "bursttime" || e.id === "arrive") && Number(e.value) < 0)
        {
            if(e.id === "bursttime")
            {
                alert(`Burst time khong duoc la so am`);
            }
            else
            {
                alert(`Arrival time khong duoc la so am`);
            }
            isFormValidFailed = true;
        }

        if(e.id === "bursttime" && Number(e.value) === 0)
        {
            alert(`Burst time khong duoc la 0`);
            isFormValidFailed = true;
        }
    })
    
    if(Number(inputQuantum) < 0)
    {
        alert(`Quantum time khong duoc la so am`);
        isFormValidFailed = true;
    }
    else if(Number(inputQuantum) === 0)
    {
        alert(`Quantum time khong duoc la so 0`);
        isFormValidFailed = true;
    }

    if(isFormValidFailed)
    {
        location.reload();
    }
    else
    {
        let inputMap = new Map();
        input.forEach((e) => {
            if(!inputMap.has(e.name))
            {
                inputMap.set(e.name, [])
            }
        })

        input.forEach((e) => {
            inputMap.get(e.name).push(Number(e.value))
        })

        for(let [key, value] of inputMap.entries())
        {
            const process = new Process(key, value[0], value[1]);
            inputArray.push(process)

        }
        event.preventDefault();

        algorithms.style.visibility = 'visible';
        algorithms.style.position = 'static';
        divFormHolder.style.visibility = 'hidden';
        divFormHolder.style.position = 'absolute';

        arrayLength = inputArray.length
        quantum = Number(inputQuantum)
        showAlgorithms(inputArray, Number(inputQuantum))

        inputArray.splice(0, inputArray.length)
    }
}

function showAlgorithms(array, quantum)
{
    sortArriveTime(array);
    calculateLineWidth(array);
    calculateDrawWidth();
    addVerticalLine();
    addWidthToHolder();
    calculateNumberOfDrawGridColumns();
    addProcessTextToGrid(array);
    setColumnsAndRowsToProcessText();
    setDefaultPositionProgressAxis();
    appendNumberToReadyQueue(array)
    drawFirstVerticalLineOnProgressAxis(Array.from(array));
    appendTable(array, quantum)
    FCFS(array);
    SJF(array);
    SRTF(array); 
    RR(array, quantum);
}

function returnToInputSite() 
{
    algorithms.style.visibility = 'hidden';
    algorithms.style.position = 'absolute';
    divFormHolder.style.visibility = 'visible';
    divFormHolder.style.position = 'static';
    location.reload()
}

































































function sortArriveTime(array)
{
    array.sort((a, b) => {
        if(a.arrive < b.arrive)
        {
            return -1;
        }
    });
}

function calculateLineWidth(array) 
{
    const lineWidth = document.querySelectorAll('.horizontal-line.x-axis');
    const arrow = document.querySelectorAll('.arrow-right');

    const calculatedSum = ((array.reduce((returnValue, arrayValue) => {     /*Calculate the line width by multiply it to 100 then divide it by half (it fits the screen)*/
        return returnValue + arrayValue["burst time"] + arrayValue.arrive;
    }, 0)) * 100)/2; 


    arrow.forEach((e) => {
        e.style.left = `${calculatedSum + 35}px`;       //Add more spaces to the x-axis
    });
    lineWidth.forEach((e) => {
        e.style.top = '27px';               //Magic number to center align the x-axis
        e.style.width = `${calculatedSum + 35}px`;      //Add more spaces to the x-axis
    });
}

function calculateDrawWidth()
{
    const draw = document.querySelectorAll('.draw');
    const ready = document.querySelectorAll('.ready');
    const lineWidth = document.querySelector('.horizontal-line');
    const lineWidthAdjusted = parseInt(lineWidth.style.width, 10) + 320;        //320 is just a magic number that align the columns with the <p>

    draw.forEach((e) => {
        e.style.width = `${lineWidthAdjusted}px`;
    });
    
    ready.forEach((e) => {
        e.style.width = `${lineWidthAdjusted - 60}px`;
    });
}



function calculateNumberOfDrawGridColumns()
{
    const nodeListOfVerticalLines = document.querySelector('.holder').querySelectorAll('.vertical-line');
    const draw = document.querySelectorAll('.draw');
    const ready = document.querySelectorAll('.ready');
    const numberOfColumns = nodeListOfVerticalLines.length;              

    draw.forEach((e) => {
        e.style.gridTemplateColumns = `repeat(${numberOfColumns}, 100px)`;
    });

    ready.forEach((e) => {
        e.style.gridTemplateColumns = `repeat(${numberOfColumns * 2}, 50px)`;
    })
}

function addVerticalLine()
{
    const holderDiv = document.querySelectorAll('.holder');
    const rubyTag = document.createElement('ruby');
    const verticalLine = document.createElement('div');
    const rtElement = document.createElement('rt');
    const lineWidth = document.querySelector('.horizontal-line');

    const absolutePositionedDiv = document.createElement('div');
    absolutePositionedDiv.style.position = 'absolute';
    verticalLine.classList.add('vertical-line');

    let nodeDiv = absolutePositionedDiv.cloneNode();
    let nodeRubyClone = rubyTag.cloneNode();
    let nodeVerticalClone = verticalLine.cloneNode();
    let nodeRtClone = rtElement.cloneNode();
    const sumOfArray = parseInt(lineWidth.style.width, 10) * 2 / 100; /*Remove 'px' from width attribute then recalculate the sum of array by reversing the calculation*/

    for(let i = 0; i <= sumOfArray; i = i + 2)
    {
        nodeRtClone.textContent = `${i}`;
        nodeDiv.style.left = `${i*100/2}px`;
        nodeDiv.appendChild(nodeRubyClone).append(nodeVerticalClone, nodeRtClone);

        holderDiv.forEach((e) => {
            let nodeAppend = nodeDiv.cloneNode(true);           //Clone its children, too
            e.append(nodeAppend);
        })
    }
}

//To fit the arrow to the right: 0; attribute
function addWidthToHolder()
{
    const holder = document.querySelectorAll('.holder');
    const lineWidth = document.querySelector('.horizontal-line');

    const holderWidth = (parseInt(lineWidth.style.width, 10) + 120);     //Plus more 15px to match the border of arrow
    holder.forEach((e) => {
        e.style.width = `${holderWidth}px`;      
    });
}

function addProcessTextToGrid(array)
{
    const grid = document.querySelectorAll('.draw');
    const spanElement = document.createElement('span');

    spanElement.classList.add('process');

    array.forEach((arrayElement) => {
        grid.forEach((gridElement) => {
            let nodeSpanClone = spanElement.cloneNode();
            nodeSpanClone.textContent = arrayElement.process;
            nodeSpanClone.classList.add(arrayElement.process);
            gridElement.appendChild(nodeSpanClone)
        });
    })
}

function setColumnsAndRowsToProcessText()
{
    const process = document.querySelectorAll('.process');
    process.forEach((e) => {
        e.style['grid-row-start'] = e.textContent.substring(1);
        e.style['grid-row-end'] = `${Number(e.textContent.substring(1)) + 1}`;
        e.style['grid-column-start'] = "1";
        e.style['grid-column-end'] = "2";
    });
}

function setDefaultPositionProgressAxis()
{
    const progressAxis = document.querySelectorAll('.horizontal-line.progress-axis');
    progressAxis.forEach((e) => {
        e.style['grid-column-start'] = "2";
        e.style['grid-column-end'] = "3";
    });
}

function drawFirstVerticalLineOnProgressAxis(process)
{
    process.forEach((e) => {
        const draw = document.querySelectorAll('.algo > .draw');
        const verticalLine = document.createElement('div');
        const holderDiv = document.createElement('div');
        const hrDashedLine = document.createElement('hr');
        const rubyTag = document.createElement('ruby');
        const rtElement = document.createElement('rt');

        holderDiv.classList.add('div-holder-vertical-line-progress-axis');
        verticalLine.classList.add('vertical-line');
        verticalLine.classList.add('progress-axis');
        hrDashedLine.classList.add(`${e.process}`);
        rtElement.textContent = e.arrive;
        holderDiv.appendChild(rubyTag).append(verticalLine, rtElement)
        holderDiv.appendChild(hrDashedLine);

        draw.forEach((i) => {
            let holderDivNodeClone = holderDiv.cloneNode(true);
            holderDivNodeClone.style['grid-row-start'] = e.process.substring(1);
            holderDivNodeClone.style['grid-row-end'] = `${Number(e.process.substring(1)) + 1}`;
            holderDivNodeClone.style['grid-column-start'] = "2";
            holderDivNodeClone.style.left = `${Number(e.arrive) * 100 /2}px`;
            i.appendChild(holderDivNodeClone);
        })
    })
}

function drawMultipleVerticalLinesOnProgressAxis(process, totalTime, algo)
{
    const holderDiv = document.createElement('div');
    const verticalLine = document.createElement('div');
    const rubyTag = document.createElement('ruby');
    const rtElement = document.createElement('rt');
    const pElement = document.createElement('p');
    holderDiv.classList.add('div-holder-vertical-line-progress-axis');
    verticalLine.classList.add('vertical-line');
    verticalLine.classList.add('progress-axis');
    pElement.textContent = "X";
    pElement.style.top = "25%";
    pElement.style.left = "50%";
    pElement.style.transform = "translate(-50%, -50%)";
    holderDiv.appendChild(rubyTag).append(verticalLine, rtElement)
    if(algo === "FCFS")
    {
        const draw = document.querySelector(`.algo.fcfs .draw`);
        const FCFSarray = process;          //better naming
        const FCFSqueue = [];
        let queueLength = arrayLength;
        let remainingTime = 0;
        let holderQueueElement = {};
        let appendVerticalLineDownLine = null;
        totalTime = process[0].arrive

        while(queueLength !== 0)
        {
            if(FCFSarray.length !== 0 && totalTime >= FCFSarray[0].arrive)
            {
                FCFSqueue.push(FCFSarray.shift())
            }
            if(remainingTime === 0 && FCFSqueue.length >= 1)
            {
                holderQueueElement = FCFSqueue.shift()
                remainingTime += holderQueueElement["burst time"];
                totalTime += holderQueueElement["burst time"];
                rtElement.textContent = totalTime;

                let holderDivNodeWithXClone = holderDiv.cloneNode(true);
                let pNodeClone = pElement.cloneNode(true)
                holderDivNodeWithXClone.appendChild(pNodeClone);
                holderDivNodeWithXClone.style['grid-row-start'] = holderQueueElement.process.substring(1);
                holderDivNodeWithXClone.style['grid-row-end'] = `${Number(holderQueueElement.process.substring(1)) + 1}`;
                holderDivNodeWithXClone.style['grid-column-start'] = "2";
                holderDivNodeWithXClone.style.left = `${Number(totalTime) * 100 /2}px`;
                draw.appendChild(holderDivNodeWithXClone);

                if(appendVerticalLineDownLine === null)
                {
                    appendVerticalLineDownLine = holderDivNodeWithXClone.cloneNode(true);
                    appendVerticalLineDownLine.removeChild(appendVerticalLineDownLine.querySelector("p"))
                    appendVerticalLineDownLine.style.left = `${Number(totalTime) * 100 /2}px`;
                }
                else
                {   
                    //Apply width to hr element
                    const hr = draw.querySelector(`hr.${holderQueueElement.process}`); 
                    let hrWidth = parseInt(appendVerticalLineDownLine.style.left, 10) - (holderQueueElement.arrive * 100 / 2);
                    hr.style.width = `${hrWidth}px`

                    appendVerticalLineDownLine.style['grid-column-start'] = "2";
                    appendVerticalLineDownLine.style['grid-row-start'] = `${Number(holderQueueElement.process.substring(1))}`;
                    appendVerticalLineDownLine.style['grid-row-end'] = `${Number(holderQueueElement.process.substring(1))}`;
                    draw.append(appendVerticalLineDownLine.cloneNode(true));
                    appendVerticalLineDownLine = holderDivNodeWithXClone.cloneNode(true);
                    appendVerticalLineDownLine.removeChild(appendVerticalLineDownLine.querySelector("p"))
                    appendVerticalLineDownLine.style.left = `${Number(totalTime) * 100 /2}px`;
                }
                queueLength--;
            }
            else if(remainingTime === 0 && FCFSqueue.length === 0 && FCFSarray.length !== 0)
            {
                appendVerticalLineDownLine = null
                totalTime++;
            }
            else if(remainingTime !== 0)
            {
                remainingTime--;
            }
        }
    }

    if(algo === "SJF")
    {
        const draw = document.querySelector(`.algo.sjf .draw`);
        let queueLength = arrayLength;
        let remainingTime = 0;
        let holderQueueElement = {};
        let appendVerticalLineDownLine = null;
        const SJFarray = process;          //better naming
        const SJFQueue = [];

        while(queueLength !== 0)
        {
            if(SJFarray.length !== 0 && totalTime >= SJFarray[0].arrive) 
            {
                SJFQueue.push(SJFarray.shift())
            }
            if(remainingTime === 0 && SJFQueue.length >= 1)
            {
                if(SJFQueue.length !== 1)
                {
                    SJFQueue.sort((a, b) => {
                        if(a["burst time"] < b["burst time"])
                        {
                            return -1;
                        }
                    })
                }  
                holderQueueElement = SJFQueue.shift();
                remainingTime += holderQueueElement["burst time"];
                totalTime += holderQueueElement["burst time"];
                rtElement.textContent = totalTime;

                let holderDivNodeWithXClone = holderDiv.cloneNode(true);
                let pNodeClone = pElement.cloneNode(true)
                holderDivNodeWithXClone.appendChild(pNodeClone);
                holderDivNodeWithXClone.style['grid-row-start'] = holderQueueElement.process.substring(1);
                holderDivNodeWithXClone.style['grid-row-end'] = `${Number(holderQueueElement.process.substring(1)) + 1}`;
                holderDivNodeWithXClone.style['grid-column-start'] = "2";
                holderDivNodeWithXClone.style.left = `${Number(totalTime) * 100 /2}px`;
                draw.appendChild(holderDivNodeWithXClone);

                if(appendVerticalLineDownLine === null)
                {
                    appendVerticalLineDownLine = holderDivNodeWithXClone.cloneNode(true);
                    appendVerticalLineDownLine.removeChild(appendVerticalLineDownLine.querySelector("p"))
                    appendVerticalLineDownLine.style.left = `${Number(totalTime) * 100 /2}px`;
                }
                else
                {   
                    //Apply width to hr element
                    const hr = draw.querySelector(`hr.${holderQueueElement.process}`); 
                    let hrWidth = parseInt(appendVerticalLineDownLine.style.left, 10) - (holderQueueElement.arrive * 100 / 2);
                    hr.style.width = `${hrWidth}px`

                    appendVerticalLineDownLine.style['grid-column-start'] = "2";
                    appendVerticalLineDownLine.style['grid-row-start'] = `${Number(holderQueueElement.process.substring(1))}`;
                    appendVerticalLineDownLine.style['grid-row-end'] = `${Number(holderQueueElement.process.substring(1))}`;
                    draw.append(appendVerticalLineDownLine.cloneNode(true));
                    appendVerticalLineDownLine = holderDivNodeWithXClone.cloneNode(true);
                    appendVerticalLineDownLine.removeChild(appendVerticalLineDownLine.querySelector("p"))
                    appendVerticalLineDownLine.style.left = `${Number(totalTime) * 100 /2}px`;
                }
                queueLength--;
            }
            else if(remainingTime === 0 && SJFQueue.length === 0 && SJFarray.length !== 0)
            {
                appendVerticalLineDownLine = null
                totalTime++;
            }
            else if(remainingTime !== 0)
            {
                remainingTime--;
            } 
        }
    }

    if(algo === "SRTF")
    {
        const draw = document.querySelector(`.algo.srtf .draw`);
        const totalProcess = arrayLength;
        let processCompleted = 0;
        let holderQueueElement = null;
        let tempHolder = {};
        let appendVerticalLineDownLine = null;
        let indexOfObject = 0;
        let smallestBurstTime = {};
        let holderDivNodeWithXClone;
        let pNodeClone;
        let queueLength = 0;
        let remainingTime = 0;
        const SRTFarray = process;          //better naming
        const SRTFQueue = [];

        //Init vertical lines with X to 0px left
        SRTFarray.forEach((e) => {
            holderDivNodeWithXClone = holderDiv.cloneNode(true);
            holderDivNodeWithXClone.classList.add(`${e.process}`);
            pNodeClone = pElement.cloneNode(true)
            holderDivNodeWithXClone.appendChild(pNodeClone);
            holderDivNodeWithXClone.style['grid-row-start'] = e.process.substring(1);
            holderDivNodeWithXClone.style['grid-row-end'] = `${Number(e.process.substring(1)) + 1}`;
            holderDivNodeWithXClone.style['grid-column-start'] = "2";
            holderDivNodeWithXClone.style.left = "0px";
            draw.appendChild(holderDivNodeWithXClone);
        });

        while(processCompleted != totalProcess)
        {
            if(SRTFarray.length !== 0 && totalTime >= SRTFarray[0].arrive)
            {
                SRTFQueue.push(SRTFarray.shift());
            }

            queueLength = SRTFQueue.length;
            if(queueLength >= 1)
            {
                smallestBurstTime = SRTFQueue.reduce((a, b) => {
                    return (a["burst time"] < b["burst time"]) ? a : b
                }, SRTFQueue[0])
                for(let i = 0; i < queueLength; i++)
                {
                    if(SRTFQueue[i].process === smallestBurstTime.process)
                    {
                        indexOfObject = i;
                        break;
                    }
                }
                SRTFQueue.splice(indexOfObject, 1);

                if(holderQueueElement === null)
                {
                    holderQueueElement = smallestBurstTime;
                    remainingTime = holderQueueElement["burst time"]
                }
                else if(remainingTime === 0 && holderQueueElement["burst time"] === 0)
                {
                    holderQueueElement = smallestBurstTime
                    remainingTime = holderQueueElement["burst time"];

                    let holderDivWithoutXClone = holderDiv.cloneNode(true)
                    let rtElement = holderDivWithoutXClone.querySelector('rt');
                    rtElement.textContent = totalTime;
                    holderDivWithoutXClone.style.left = `${totalTime * 100 / 2}px`;
                    appendVerticalLineDownLine = holderDivWithoutXClone.cloneNode(true);
                    appendVerticalLineDownLine.style.left = `${Number(totalTime) * 100 /2}px`;
                    appendVerticalLineDownLine.style['grid-column-start'] = '2';
                    appendVerticalLineDownLine.style['grid-row-start'] = holderQueueElement.process.substring(1);
                    appendVerticalLineDownLine.style['grid-row-end'] = `${Number(holderQueueElement.process.substring(1)) + 1}`;
                    draw.appendChild(appendVerticalLineDownLine)
                }
                else
                {
                    if(holderQueueElement["burst time"] > smallestBurstTime["burst time"])
                    {
                        let holderDivWithoutXClone = holderDiv.cloneNode(true)
                        let rtElement = holderDivWithoutXClone.querySelector('rt');
                        rtElement.textContent = totalTime;
                        holderDivWithoutXClone.style.left = `${totalTime * 100 / 2}px`;
                        holderDivWithoutXClone.style['grid-column-start'] = '2';
                        holderDivWithoutXClone.style['grid-row-start'] = holderQueueElement.process.substring(1);
                        holderDivWithoutXClone.style['grid-row-end'] = `${Number(holderQueueElement.process.substring(1)) + 1}`;
                        draw.append(holderDivWithoutXClone);

                        holderQueueElement["burst time"] = remainingTime
                        tempHolder = holderQueueElement;
                        holderQueueElement = smallestBurstTime;
                        remainingTime = holderQueueElement["burst time"]
                        SRTFQueue.push(tempHolder)

                        holderDivWithoutXClone = holderDiv.cloneNode(true)
                        rtElement = holderDivWithoutXClone.querySelector('rt');
                        rtElement.textContent = totalTime;
                        holderDivWithoutXClone.style.left = `${totalTime * 100 / 2}px`;
                        holderDivWithoutXClone.style['grid-column-start'] = '2';
                        holderDivWithoutXClone.style['grid-row-start'] = holderQueueElement.process.substring(1);
                        holderDivWithoutXClone.style['grid-row-end'] = `${Number(holderQueueElement.process.substring(1)) + 1}`;
                        draw.append(holderDivWithoutXClone);

                    }
                    else
                    {
                        SRTFQueue.push(smallestBurstTime)
                    }
                }
            }
            if(remainingTime === 0 && SRTFQueue.length === 0 && SRTFarray.length !== 0)
            {
                totalTime++;
            }
            else if(remainingTime !== 0)
            {
                totalTime++;
                holderQueueElement["burst time"]--;
                remainingTime--;
                const holderDivNodeWithXClone = draw.querySelector(`.div-holder-vertical-line-progress-axis.${holderQueueElement.process}`);
                const rtElement = holderDivNodeWithXClone.querySelector('rt');
                rtElement.textContent = totalTime
                holderDivNodeWithXClone.style.left = `${totalTime * 100 / 2}px`;

                if(remainingTime === 0)
                {
                    processCompleted++;
                }
            }
        }
    }

    if(algo === "RR")
    {
        const draw = document.querySelector(`.algo.rr .draw`);
        const totalProcess = arrayLength;
        let processCompleted = 0;
        let shiftedObjectHolder = null;
        let tempHolder = {};
        let appendVerticalLineDownLine = null;
        let indexOfObject = 0;
        let smallestBurstTime = {};
        let holderDivNodeWithXClone;
        let pNodeClone;
        let queueLength = 0;
        let RRarrayLength = 0;
        let remainingTime = 0;
        const RRarray = process;          //better naming
        const RRQueue = [];


        //Init vertical lines with X to 0px left
        RRarray.forEach((e) => {
            holderDivNodeWithXClone = holderDiv.cloneNode(true);
            holderDivNodeWithXClone.classList.add(`${e.process}`);
            pNodeClone = pElement.cloneNode(true)
            holderDivNodeWithXClone.appendChild(pNodeClone);
            holderDivNodeWithXClone.style['grid-row-start'] = e.process.substring(1);
            holderDivNodeWithXClone.style['grid-row-end'] = `${Number(e.process.substring(1)) + 1}`;
            holderDivNodeWithXClone.style['grid-column-start'] = "2";
            holderDivNodeWithXClone.style.left = "0px";
            draw.appendChild(holderDivNodeWithXClone);
        });

        RRarray.forEach((e) => {
            e["times"] = 0;
        })

        while(processCompleted !== totalProcess)
        {
            RRarrayLength = RRarray.length;
            if(RRarrayLength !== 0 && totalTime >= RRarray[0].arrive)
            {
                RRQueue.push(RRarray.shift());
            }

            if(RRQueue.length >= 1)
            {
                if(shiftedObjectHolder === null)
                {
                    shiftedObjectHolder = RRQueue.shift();
                    remainingTime = shiftedObjectHolder["burst time"]
                }
                else if(remainingTime === 0 && shiftedObjectHolder["burst time"] === 0)
                {
                    shiftedObjectHolder = RRQueue.shift();
                    remainingTime = shiftedObjectHolder["burst time"];

                    let holderDivWithoutXClone = holderDiv.cloneNode(true)
                    let rtElement = holderDivWithoutXClone.querySelector('rt');
                    rtElement.textContent = totalTime;
                    holderDivWithoutXClone.style.left = `${totalTime * 100 / 2}px`;
                    holderDivWithoutXClone.style['grid-column-start'] = '2';
                    holderDivWithoutXClone.style['grid-row-start'] = shiftedObjectHolder.process.substring(1);
                    holderDivWithoutXClone.style['grid-row-end'] = `${Number(shiftedObjectHolder.process.substring(1)) + 1}`;

                    draw.append(holderDivWithoutXClone);
                }
                else
                {
                    if(shiftedObjectHolder["times"] === quantum)
                    {
                        let holderDivWithoutXClone = holderDiv.cloneNode(true)
                        let rtElement = holderDivWithoutXClone.querySelector('rt');
                        rtElement.textContent = totalTime;
                        holderDivWithoutXClone.style.left = `${totalTime * 100 / 2}px`;
                        holderDivWithoutXClone.style['grid-column-start'] = '2';
                        holderDivWithoutXClone.style['grid-row-start'] = shiftedObjectHolder.process.substring(1);
                        holderDivWithoutXClone.style['grid-row-end'] = `${Number(shiftedObjectHolder.process.substring(1)) + 1}`;
                        draw.append(holderDivWithoutXClone);

                        shiftedObjectHolder["times"] = 0;
                        shiftedObjectHolder["burst time"] = remainingTime
                        tempHolder = shiftedObjectHolder;
                        shiftedObjectHolder = RRQueue.shift();
                        remainingTime = shiftedObjectHolder["burst time"]
                        RRQueue.push(tempHolder)

                        holderDivWithoutXClone = holderDiv.cloneNode(true)
                        rtElement = holderDivWithoutXClone.querySelector('rt');
                        rtElement.textContent = totalTime;
                        holderDivWithoutXClone.style.left = `${totalTime * 100 / 2}px`;
                        holderDivWithoutXClone.style['grid-column-start'] = '2';
                        holderDivWithoutXClone.style['grid-row-start'] = shiftedObjectHolder.process.substring(1);
                        holderDivWithoutXClone.style['grid-row-end'] = `${Number(shiftedObjectHolder.process.substring(1)) + 1}`;
                        draw.append(holderDivWithoutXClone);

                    }
                }
            }
            else
            {
                if(shiftedObjectHolder["times"] === quantum)
                {
                    let holderDivWithoutXClone = holderDiv.cloneNode(true)
                    let rtElement = holderDivWithoutXClone.querySelector('rt');
                    rtElement.textContent = totalTime;
                    holderDivWithoutXClone.style.left = `${totalTime * 100 / 2}px`;
                    holderDivWithoutXClone.style['grid-column-start'] = '2';
                    holderDivWithoutXClone.style['grid-row-start'] = shiftedObjectHolder.process.substring(1);
                    holderDivWithoutXClone.style['grid-row-end'] = `${Number(shiftedObjectHolder.process.substring(1)) + 1}`;
                    draw.append(holderDivWithoutXClone);

                    shiftedObjectHolder["times"] = 0;
                }
            }
            if(remainingTime === 0 && RRQueue.length === 0 && RRarray.length !== 0)
            {
                totalTime++;
            }
            else if(remainingTime !== 0)
            {
                shiftedObjectHolder["times"]++;
                shiftedObjectHolder["burst time"]--;
                remainingTime--
                totalTime++;

                const holderDivNodeWithXClone = draw.querySelector(`.div-holder-vertical-line-progress-axis.${shiftedObjectHolder.process}`);
                const rtElement = holderDivNodeWithXClone.querySelector('rt');
                rtElement.textContent = totalTime
                holderDivNodeWithXClone.style.left = `${totalTime * 100 / 2}px`;

                if(shiftedObjectHolder["burst time"] === 0)
                {
                    processCompleted++;
                }
            }
        }
    }
}

function drawHorizontalLineOnProgressAxis(process, totalTime, algo)
{
    if(algo === "FCFS")
    {
        const FCFSarray = process;          //better naming
        const FCFSqueue = [];
        const draw = document.querySelector('.algo.fcfs > .draw');
        const horizontalLine = document.createElement('div');

        horizontalLine.classList.add('horizontal-line');
        horizontalLine.classList.add('progress-axis');

        let queueLength = arrayLength;
        let remainingTime = 0;
        let holderQueueElement = {};
        totalTime = process[0].arrive

        while(queueLength !== 0)
        {
            if(FCFSarray.length !== 0 && totalTime >= FCFSarray[0].arrive)
            {
                FCFSqueue.push(FCFSarray.shift())
            }
            if(remainingTime === 0 && FCFSqueue.length >= 1)
            {
                holderQueueElement = FCFSqueue.shift()
                let calculatedHorizontalLineWidth = Number(holderQueueElement["burst time"]) * 100 / 2;
                let horizontalLineNodeClone = horizontalLine.cloneNode();
                horizontalLineNodeClone.style['grid-row-start'] = holderQueueElement.process.substring(1);
                horizontalLineNodeClone.style['grid-row-end'] = `${Number(holderQueueElement.process.substring(1)) + 1}`;
                horizontalLineNodeClone.style['grid-column-start'] = "2";
                horizontalLineNodeClone.style.left = `${Number(totalTime) * 100 / 2}px`;
                horizontalLineNodeClone.style.width = `${calculatedHorizontalLineWidth}px`;
                draw.appendChild(horizontalLineNodeClone);

                remainingTime += holderQueueElement["burst time"];
                totalTime += holderQueueElement["burst time"];

                queueLength--;
            }
            else if(remainingTime === 0 && FCFSqueue.length === 0 && FCFSarray.length !== 0)
            {
                totalTime++;
            }
            else if(remainingTime !== 0)
            {
                remainingTime--;
            }
        }
    }

    if(algo === "SJF")
    {
        const draw = document.querySelector('.algo.sjf > .draw');
        const horizontalLine = document.createElement('div');
        const SJFArray = process;
        const SJFQueue = [];
        let queueLength = process.length;
        let remainingTime = 0;
        let holderQueueElement = {};
        horizontalLine.classList.add('horizontal-line');
        horizontalLine.classList.add('progress-axis');

        while(queueLength !== 0)
        {
            if(SJFArray.length !== 0 && totalTime >= SJFArray[0].arrive)
            {
                SJFQueue.push(SJFArray.shift());
            }
            if(remainingTime === 0 && SJFQueue.length >= 1)
            {
                if(SJFQueue.length !== 1)
                {
                    SJFQueue.sort((a, b) => {
                        if(a["burst time"] < b["burst time"])
                        {
                            return -1;
                        }
                    })
                }
                holderQueueElement = SJFQueue.shift();   
                remainingTime += holderQueueElement["burst time"];
                let calculatedHorizontalLineWidth = Number(holderQueueElement["burst time"]) * 100 / 2;
                let horizontalLineNodeClone = horizontalLine.cloneNode();
                horizontalLineNodeClone.style['grid-row-start'] = holderQueueElement.process.substring(1);
                horizontalLineNodeClone.style['grid-row-end'] = `${Number(holderQueueElement.process.substring(1)) + 1}`;
                horizontalLineNodeClone.style['grid-column-start'] = "2";
                horizontalLineNodeClone.style.left = `${Number(totalTime) * 100 / 2}px`;
                horizontalLineNodeClone.style.width = `${calculatedHorizontalLineWidth}px`;
                draw.appendChild(horizontalLineNodeClone);
                totalTime += holderQueueElement["burst time"];
                queueLength--;
            }
            else if(remainingTime === 0 && SJFQueue.length === 0 && SJFArray.length !== 0)
            {
                totalTime++
            }
            else if(remainingTime !== 0)
            {
                remainingTime--;
            }
        }
    }

    if(algo === "SRTF")
    {
        const draw = document.querySelector('.algo.srtf > .draw');
        const horizontalLine = document.createElement('div');
        const SRTFarray = process;
        const SRTFQueue = [];
        const totalProcess = arrayLength;
        let processCompleted = 0;
        let horizontalLineNodeClone;
        let holderQueueElement = null;
        let tempHolder = {};
        let indexOfObject = 0;
        let smallestBurstTime = {};
        let SRTFQueueLength = 0;
        let remainingTime = 0;
        let horizontalLineQuery;
        let hrDashedLine;

        horizontalLine.classList.add('horizontal-line');
        horizontalLine.classList.add('progress-axis');

        //Added horizontal line with process name
        SRTFarray.forEach((e) => {
            horizontalLineNodeClone = horizontalLine.cloneNode();
            horizontalLineNodeClone.classList.add(`${e.process}`);
            horizontalLineNodeClone.style['grid-row-start'] = `${e.process.substring(1)}`
            horizontalLineNodeClone.style['grid-row-end'] = `${Number(e.process.substring(1)) + 1}`
            horizontalLineNodeClone.style['grid-column-start'] = "2"
            draw.appendChild(horizontalLineNodeClone)
        })

        SRTFarray.forEach((e) => {
            e["remaining time"] = e["burst time"];
            e["dashed line already"] = false;
        })


        while(processCompleted !== totalProcess)
        {
            if(SRTFarray.length !== 0 && totalTime >= SRTFarray[0].arrive)
            {
                SRTFQueue.push(SRTFarray.shift());
            }

            if(SRTFQueue.length >= 1)
            {
                SRTFQueueLength = SRTFQueue.length;
                smallestBurstTime = SRTFQueue.reduce((a, b) => {
                    return (a["burst time"] < b["burst time"]) ? a : b;
                }, SRTFQueue[0])
                for(let i = 0; i < SRTFQueueLength; i++)
                {
                    if(smallestBurstTime.process === SRTFQueue[i].process)
                    {
                        indexOfObject = i;
                        break;
                    }
                }
                SRTFQueue.splice(indexOfObject, 1);
                
                if(holderQueueElement === null)
                {
                    holderQueueElement = smallestBurstTime;
                    remainingTime = holderQueueElement["burst time"]
                    horizontalLineQuery = draw.querySelector(`.horizontal-line.progress-axis.${holderQueueElement.process}`);
                    horizontalLineQuery.style.left = `${totalTime * 100 / 2}px`;

                    hrDashedLine = draw.querySelector(`hr.${holderQueueElement.process}`)
                }
                else if(remainingTime === 0 && holderQueueElement["burst time"] === 0)
                {
                    // horizontalLineQuery.style.width = `${(holderQueueElement["remaining time"]) * 100 / 2}px`;
                    horizontalLineQuery.classList.remove(`${holderQueueElement.process}`);

                    if(holderQueueElement["dashed line already"] === false)
                    {
                        hrDashedLine.style.width = `${(totalTime - holderQueueElement.arrive - (holderQueueElement["remaining time"] - holderQueueElement["burst time"])) * 100 / 2}px`;
                        holderQueueElement["dashed line already"] = true;
                    }

                    holderQueueElement = smallestBurstTime;
                    remainingTime = holderQueueElement["burst time"]


                    horizontalLineNodeClone = horizontalLine.cloneNode();
                    horizontalLineNodeClone.classList.add(`${holderQueueElement.process}`);
                    horizontalLineNodeClone.style['grid-row-start'] = `${holderQueueElement.process.substring(1)}`
                    horizontalLineNodeClone.style['grid-row-end'] = `${Number(holderQueueElement.process.substring(1)) + 1}`
                    horizontalLineNodeClone.style['grid-column-start'] = "2"
                    draw.appendChild(horizontalLineNodeClone)

                    horizontalLineQuery = draw.querySelector(`.horizontal-line.progress-axis.${holderQueueElement.process}`);
                    horizontalLineQuery.style.left = `${totalTime * 100 / 2}px`;

                    hrDashedLine = draw.querySelector(`hr.${holderQueueElement.process}`);
                }
                else
                {
                    if(holderQueueElement["burst time"] > smallestBurstTime["burst time"])
                    {
                        horizontalLineQuery.classList.remove(`${holderQueueElement.process}`);
                        horizontalLineQuery.style.width = `${(holderQueueElement["remaining time"] - holderQueueElement["burst time"]) * 100 / 2}px`

                        if(holderQueueElement["dashed line already"] === false)
                        {
                            hrDashedLine.style.width = `${(totalTime - holderQueueElement.arrive - (holderQueueElement["remaining time"] - holderQueueElement["burst time"])) * 100 / 2}px`;
                            holderQueueElement["dashed line already"] = true;
                        }

                        holderQueueElement["remaining time"] -= (holderQueueElement["remaining time"] - holderQueueElement["burst time"]);
                        // draw.appendChild(horizontalLineQuery)

                        holderQueueElement["burst time"] = remainingTime
                        tempHolder = holderQueueElement;
                        holderQueueElement = smallestBurstTime;
                        remainingTime = holderQueueElement["burst time"]
                        SRTFQueue.push(tempHolder);

                        hrDashedLine = draw.querySelector(`hr.${holderQueueElement.process}`);

                        horizontalLineNodeClone = horizontalLine.cloneNode();
                        horizontalLineNodeClone.classList.add(`${holderQueueElement.process}`);
                        horizontalLineNodeClone.style['grid-row-start'] = `${holderQueueElement.process.substring(1)}`
                        horizontalLineNodeClone.style['grid-row-end'] = `${Number(holderQueueElement.process.substring(1)) + 1}`
                        horizontalLineNodeClone.style['grid-column-start'] = "2"
                        draw.appendChild(horizontalLineNodeClone)

                        horizontalLineQuery = draw.querySelector(`.horizontal-line.progress-axis.${holderQueueElement.process}`);
                        horizontalLineQuery.style.left = `${totalTime * 100 / 2}px`;
                    }
                    else
                    {
                        SRTFQueue.push(smallestBurstTime);
                    }
                }
            }
            if(remainingTime === 0 && SRTFQueue.length === 0 && SRTFarray.length !== 0)
            {
                totalTime++;
            }
            else if(remainingTime !== 0)
            {
                totalTime++;
                holderQueueElement["burst time"]--;
                remainingTime--

                if(holderQueueElement["dashed line already"] === false)
                {
                    hrDashedLine.style.width = `${(totalTime - holderQueueElement.arrive - (holderQueueElement["remaining time"] - holderQueueElement["burst time"])) * 100 / 2}px`;
                    holderQueueElement["dashed line already"] = true;
                }

                if(remainingTime === 0)
                {
                    horizontalLineQuery.style.width = `${(holderQueueElement["remaining time"]) * 100 / 2}px`;
                    horizontalLineQuery.classList.remove(`${holderQueueElement.process}`);
                    processCompleted++;
                }
            }
        }
    }

    if(algo === "RR")
    {
        const draw = document.querySelector('.algo.rr > .draw');
        const horizontalLine = document.createElement('div');
        const RRarray = process;
        const RRQueue = [];
        const totalProcess = arrayLength;
        let processCompleted = 0;
        let horizontalLineNodeClone;
        let shiftedObjectHolder = null;
        let tempHolder = {};
        let remainingTime = 0;
        let RRarrayLength = 0;
        let horizontalLineQuery;
        let hrDashedLine;

        horizontalLine.classList.add('horizontal-line');
        horizontalLine.classList.add('progress-axis');

        //Added horizontal line with process name
        RRarray.forEach((e) => {
            horizontalLineNodeClone = horizontalLine.cloneNode();
            horizontalLineNodeClone.classList.add(`${e.process}`);
            horizontalLineNodeClone.style['grid-row-start'] = `${e.process.substring(1)}`
            horizontalLineNodeClone.style['grid-row-end'] = `${Number(e.process.substring(1)) + 1}`
            horizontalLineNodeClone.style['grid-column-start'] = "2"
            draw.appendChild(horizontalLineNodeClone)
        })

        RRarray.forEach((e) => {
            e["times"] = 0;
            e["remaining time"] = e["burst time"];
            e["dashed line already"] = false;
        })

        while(processCompleted !== totalProcess)
        {
            RRarrayLength = RRarray.length;
            if(RRarrayLength !== 0 && totalTime >= RRarray[0].arrive)
            {
                RRQueue.push(RRarray.shift());
            }

            if(RRQueue.length >= 1)
            {
                if(shiftedObjectHolder === null)
                {
                    shiftedObjectHolder = RRQueue.shift();
                    remainingTime = shiftedObjectHolder["burst time"]

                    horizontalLineQuery = draw.querySelector(`.horizontal-line.progress-axis.${shiftedObjectHolder.process}`);
                    horizontalLineQuery.style.left = `${totalTime * 100 / 2}px`;
                    hrDashedLine = draw.querySelector(`hr.${shiftedObjectHolder.process}`)
                }
                else if(remainingTime === 0 && shiftedObjectHolder["burst time"] === 0)
                {
                    shiftedObjectHolder = RRQueue.shift();
                    remainingTime = shiftedObjectHolder["burst time"];

                    horizontalLineNodeClone = horizontalLine.cloneNode();
                    horizontalLineNodeClone.classList.add(`${shiftedObjectHolder.process}`);
                    horizontalLineNodeClone.style['grid-row-start'] = `${shiftedObjectHolder.process.substring(1)}`
                    horizontalLineNodeClone.style['grid-row-end'] = `${Number(shiftedObjectHolder.process.substring(1)) + 1}`
                    horizontalLineNodeClone.style['grid-column-start'] = "2"
                    draw.appendChild(horizontalLineNodeClone)

                    horizontalLineQuery = draw.querySelector(`.horizontal-line.progress-axis.${shiftedObjectHolder.process}`);
                    horizontalLineQuery.style.left = `${totalTime * 100 / 2}px`;

                    hrDashedLine = draw.querySelector(`hr.${shiftedObjectHolder.process}`);
                }
                else
                {
                    if(shiftedObjectHolder["times"] === quantum)
                    {
                        horizontalLineQuery.classList.remove(`${shiftedObjectHolder.process}`);
                        horizontalLineQuery.style.width = `${(shiftedObjectHolder["remaining time"] - shiftedObjectHolder["burst time"]) * 100 / 2}px`

                        if(shiftedObjectHolder["dashed line already"] === false)
                        {
                            hrDashedLine.style.width = `${(totalTime - shiftedObjectHolder.arrive - (shiftedObjectHolder["remaining time"] - shiftedObjectHolder["burst time"])) * 100 / 2}px`;
                            shiftedObjectHolder["dashed line already"] = true;
                        }

                        shiftedObjectHolder["remaining time"] -= (shiftedObjectHolder["remaining time"] - shiftedObjectHolder["burst time"]);

                        shiftedObjectHolder["times"] = 0;
                        shiftedObjectHolder["burst time"] = remainingTime;
                        tempHolder = shiftedObjectHolder;
                        shiftedObjectHolder = RRQueue.shift();
                        remainingTime = shiftedObjectHolder["burst time"]
                        RRQueue.push(tempHolder)

                        hrDashedLine = draw.querySelector(`hr.${shiftedObjectHolder.process}`);

                        horizontalLineNodeClone = horizontalLine.cloneNode();
                        horizontalLineNodeClone.classList.add(`${shiftedObjectHolder.process}`);
                        horizontalLineNodeClone.style['grid-row-start'] = `${shiftedObjectHolder.process.substring(1)}`
                        horizontalLineNodeClone.style['grid-row-end'] = `${Number(shiftedObjectHolder.process.substring(1)) + 1}`
                        horizontalLineNodeClone.style['grid-column-start'] = "2"
                        draw.appendChild(horizontalLineNodeClone)

                        horizontalLineQuery = draw.querySelector(`.horizontal-line.progress-axis.${shiftedObjectHolder.process}`);
                        horizontalLineQuery.style.left = `${totalTime * 100 / 2}px`;
                    }
                }
            }
            if(remainingTime === 0 && RRQueue.length === 0 && RRarray.length !== 0)
            {
                totalTime++;
            }
            if(remainingTime !== 0)
            {
                shiftedObjectHolder["times"]++;
                shiftedObjectHolder["burst time"]--;
                remainingTime--;
                totalTime++;

                if(remainingTime === 0)
                {
                    horizontalLineQuery.style.width = `${(shiftedObjectHolder["remaining time"]) * 100 / 2}px`;
                    horizontalLineQuery.classList.remove(`${shiftedObjectHolder.process}`);
                    processCompleted++;
                }
            }
        }
    }
}

function appendNumberToReadyQueue(array)
{
    const readyQueue = document.querySelectorAll('.ready');
    const spanElement = document.createElement('span');
    let columnStart = 2;
    let columnEnd = 3;

    spanElement.style.position = 'absolute';

    let totalWaitingTime = array.reduce((initValue, arrayValue) => {
        return initValue + arrayValue["burst time"] + arrayValue.arrive;
    }, 0);

    for(let i = 0; i < totalWaitingTime; i++)
    {
        let spanNodeClone = spanElement.cloneNode();
        spanNodeClone.classList.add('span-ready');
        spanNodeClone.textContent = `${i}`;
        spanNodeClone.style['grid-column-start'] = `${columnStart}`;
        spanNodeClone.style['grid-column-end'] = `${columnEnd}`;
        spanNodeClone.style['grid-row-start'] = `1`;
        spanNodeClone.style['grid-row-end'] = `2`;

        spanNodeClone.style.fontSize = "25px";

        readyQueue.forEach((e) => {
            let nodeClone = spanNodeClone.cloneNode(true)
            e.appendChild(nodeClone);
        });
        columnStart++;
        columnEnd++;
    }
}

function appendRemaining(readyQueue, rowStart, rowEnd, columnStart, columnEnd, algo)
{
    if(readyQueue.length === 0)
    {
        return 0;
    }

    if(algo === "FCFS")
    {
        const ready = document.querySelector('.fcfs > .ready');
        const divNonRedCircle = document.createElement('div');
        const divHolder = document.createElement('div');
        const subElement = document.createElement('sub');
        const supElement = document.createElement('sup');
        divNonRedCircle.classList.add('div-non-red-circle');

        readyQueue.forEach((e) => {
            let divNonRedCircleNodeClone = divNonRedCircle.cloneNode();
            let divTextHolderNodeClone = divHolder.cloneNode();
            let subTextHolderNodeClone = subElement.cloneNode();
            let supTextHolderNodeClone = supElement.cloneNode();

            supTextHolderNodeClone.textContent = e["burst time"];
            subTextHolderNodeClone.textContent = e.process.substring(1);
            divTextHolderNodeClone.append(e.process.charAt(0), supTextHolderNodeClone, subTextHolderNodeClone);
            divTextHolderNodeClone.style.fontSize = "20px"
            divNonRedCircleNodeClone.appendChild(divTextHolderNodeClone);

            divNonRedCircleNodeClone.style['grid-column-start'] = `${columnStart}`;
            divNonRedCircleNodeClone.style['grid-column-end'] = `${columnEnd}`;
            divNonRedCircleNodeClone.style['grid-row-start'] = `${rowStart}`;
            divNonRedCircleNodeClone.style['grid-row-end'] = `${rowEnd}`;


            ready.appendChild(divNonRedCircleNodeClone)
            rowStart++;
            rowEnd++;
        })
    }

    if(algo === "SJF")
    {
        const ready = document.querySelector('.sjf > .ready');
        const divNonRedCircle = document.createElement('div');
        const divHolder = document.createElement('div');
        const subElement = document.createElement('sub');
        const supElement = document.createElement('sup');
        divNonRedCircle.classList.add('div-non-red-circle');

        readyQueue.forEach((e) => {
            let divNonRedCircleNodeClone = divNonRedCircle.cloneNode();
            let divTextHolderNodeClone = divHolder.cloneNode();
            let subTextHolderNodeClone = subElement.cloneNode();
            let supTextHolderNodeClone = supElement.cloneNode();

            supTextHolderNodeClone.textContent = e["burst time"];
            subTextHolderNodeClone.textContent = e.process.substring(1);
            divTextHolderNodeClone.append(e.process.charAt(0), supTextHolderNodeClone, subTextHolderNodeClone);
            divTextHolderNodeClone.style.fontSize = "20px"
            divNonRedCircleNodeClone.appendChild(divTextHolderNodeClone);

            divNonRedCircleNodeClone.style['grid-column-start'] = `${columnStart}`;
            divNonRedCircleNodeClone.style['grid-column-end'] = `${columnEnd}`;
            divNonRedCircleNodeClone.style['grid-row-start'] = `${rowStart}`;
            divNonRedCircleNodeClone.style['grid-row-end'] = `${rowEnd}`;


            ready.appendChild(divNonRedCircleNodeClone)
            rowStart++;
            rowEnd++;
        })
    }
 
    if(algo === "RR")
    {
        const ready = document.querySelector('.rr > .ready');
        const divNonRedCircle = document.createElement('div');
        const divHolder = document.createElement('div');
        const subElement = document.createElement('sub');
        const supElement = document.createElement('sup');
        divNonRedCircle.classList.add('div-non-red-circle');

        readyQueue.forEach((e) => {
            let divNonRedCircleNodeClone = divNonRedCircle.cloneNode();
            let divTextHolderNodeClone = divHolder.cloneNode();
            let subTextHolderNodeClone = subElement.cloneNode();
            let supTextHolderNodeClone = supElement.cloneNode();

            supTextHolderNodeClone.textContent = e["burst time"];
            subTextHolderNodeClone.textContent = e.process.substring(1);
            divTextHolderNodeClone.append(e.process.charAt(0), supTextHolderNodeClone, subTextHolderNodeClone);
            divTextHolderNodeClone.style.fontSize = "20px"
            divNonRedCircleNodeClone.appendChild(divTextHolderNodeClone);

            divNonRedCircleNodeClone.style['grid-column-start'] = `${columnStart}`;
            divNonRedCircleNodeClone.style['grid-column-end'] = `${columnEnd}`;
            divNonRedCircleNodeClone.style['grid-row-start'] = `${rowStart}`;
            divNonRedCircleNodeClone.style['grid-row-end'] = `${rowEnd}`;


            ready.appendChild(divNonRedCircleNodeClone)
            rowStart++;
            rowEnd++;
        })
    }
}

function appendProcessToReadyQueue(array, algo)
{
    const readyQueue = [];
    let queueLength = arrayLength;
    const divRedCircle = document.createElement('div');
    const divNonRedCircle = document.createElement('div');
    const divHolder = document.createElement('div');
    const subElement = document.createElement('sub');
    const supElement = document.createElement('sup');

    divRedCircle.classList.add('red-circle');
    divNonRedCircle.classList.add('div-non-red-circle');



    if(algo === "FCFS")
    {
        const ready = document.querySelector('.fcfs > .ready');
        let burstTime = 0;
        let columnStart = Number(array[0].arrive) + 2;
        let columnEnd = Number(array[0].arrive) + 3;
        let rowStart = 2
        let rowEnd = 3;
        let shiftedObjectHolder = {};
        let totalTime = array[0].arrive;

        while(queueLength !== 0)
        {
            if(array.length !== 0 && totalTime >= array[0].arrive)
            {
                readyQueue.push(array.shift());
            }
            if(burstTime === 0 && readyQueue.length >= 1)
            {
                shiftedObjectHolder = readyQueue.shift();
                let divRedCircleNodeClone = divRedCircle.cloneNode();
                let divTextHolderNodeClone = divHolder.cloneNode();
                let subTextHolderNodeClone = subElement.cloneNode();
                let supTextHolderNodeClone = supElement.cloneNode();

                burstTime += shiftedObjectHolder["burst time"];
                supTextHolderNodeClone.textContent = shiftedObjectHolder["burst time"];
                subTextHolderNodeClone.textContent = shiftedObjectHolder.process.substring(1);
                divTextHolderNodeClone.append(shiftedObjectHolder.process.charAt(0), supTextHolderNodeClone, subTextHolderNodeClone)
                divTextHolderNodeClone.style.fontSize = "20px"
                divRedCircleNodeClone.appendChild(divTextHolderNodeClone);

                divRedCircleNodeClone.style['grid-column-start'] = `${columnStart}`;
                divRedCircleNodeClone.style['grid-column-end'] = `${columnEnd}`;
                divRedCircleNodeClone.style['grid-row-start'] = `${rowStart}`;
                divRedCircleNodeClone.style['grid-row-end'] = `${rowEnd}`;

                ready.appendChild(divRedCircleNodeClone);
                appendRemaining(readyQueue, rowStart + 1, rowEnd + 1, columnStart, columnEnd, "FCFS")

                columnStart++;
                columnEnd++;
                burstTime--;
                queueLength--;
                totalTime++;
            }
            else if(burstTime === 0 && readyQueue.length === 0 && array.length !== 0)
            {
                readyQueue.forEach((e) => {
                    let divNonRedCircleNodeClone = divNonRedCircle.cloneNode();
                    let divTextHolderNodeClone = divHolder.cloneNode();
                    let subTextHolderNodeClone = subElement.cloneNode();
                    let supTextHolderNodeClone = supElement.cloneNode();
                
                    supTextHolderNodeClone.textContent = e["burst time"];
                    subTextHolderNodeClone.textContent = e.process.substring(1);
                    divTextHolderNodeClone.append(e.process.charAt(0), supTextHolderNodeClone, subTextHolderNodeClone);
                    divTextHolderNodeClone.style.fontSize = "20px"
                    divNonRedCircleNodeClone.appendChild(divTextHolderNodeClone);
                
                    divNonRedCircleNodeClone.style['grid-column-start'] = `${columnStart}`;
                    divNonRedCircleNodeClone.style['grid-column-end'] = `${columnEnd}`;
                    divNonRedCircleNodeClone.style['grid-row-start'] = `${rowStart}`;
                    divNonRedCircleNodeClone.style['grid-row-end'] = `${rowEnd}`;
                
                    ready.appendChild(divNonRedCircleNodeClone)
                
                    rowStart++;
                    rowEnd++;
                })    
                rowStart = 2
                rowEnd = 3;
                columnStart++;
                columnEnd++;
                totalTime++;
            }
            else if(burstTime !== 0)
            {
                appendRemaining(readyQueue, rowStart, rowEnd, columnStart, columnEnd, "FCFS")
                burstTime--;
                totalTime++;
                columnStart++;
                columnEnd++;
            }
        }
    }

    if(algo === "SJF")
    {
        const ready = document.querySelector('.sjf > .ready');
        let burstTime = 0;
        let columnStart = Number(array[0].arrive) + 2;
        let columnEnd = Number(array[0].arrive) + 3;
        let rowStart = 2;
        let rowEnd = 3;
        let holderQueueElement = {};
        let indexOfObject = 0;
        let totalTime = array[0].arrive;

        while(queueLength !== 0)
        {
            if(array.length !== 0 && totalTime >= array[0].arrive)
            {
                readyQueue.push(array.shift())
            }
            if(burstTime === 0 && readyQueue.length >= 1)
            {
                holderQueueElement = readyQueue.reduce((a, b) => {
                                            return (a["burst time"] < b["burst time"]) ? a : b;
                                        }, readyQueue[0]);
                                    
                for(let i = 0; i < readyQueue.length; i++)
                {
                    if(readyQueue[i].process === holderQueueElement.process)
                    {
                        indexOfObject = i;
                        break;
                    }
                }

                burstTime += holderQueueElement["burst time"];
                let divRedCircleNodeClone = divRedCircle.cloneNode();
                let divTextHolderNodeClone = divHolder.cloneNode();
                let subTextHolderNodeClone = subElement.cloneNode();
                let supTextHolderNodeClone = supElement.cloneNode();

                for(let i = 0; i < readyQueue.length; i++)
                {
                    if(i === indexOfObject)
                    {
                        supTextHolderNodeClone.textContent = holderQueueElement["burst time"];
                        subTextHolderNodeClone.textContent = holderQueueElement.process.substring(1);
                        divTextHolderNodeClone.append(holderQueueElement.process.charAt(0), supTextHolderNodeClone, subTextHolderNodeClone)
                        divTextHolderNodeClone.style.fontSize = "20px"
                        divRedCircleNodeClone.appendChild(divTextHolderNodeClone);

                        divRedCircleNodeClone.style['grid-column-start'] = `${columnStart}`;
                        divRedCircleNodeClone.style['grid-column-end'] = `${columnEnd}`;
                        divRedCircleNodeClone.style['grid-row-start'] = `${indexOfObject + 2}`;
                        divRedCircleNodeClone.style['grid-row-end'] = `${indexOfObject + 3}`;

                        ready.appendChild(divRedCircleNodeClone);
                    }
                    else
                    {
                        let divNonRedCircleNodeClone = divNonRedCircle.cloneNode();
                        let divTextHolderNodeClone = divHolder.cloneNode();
                        let subTextHolderNodeClone = subElement.cloneNode();
                        let supTextHolderNodeClone = supElement.cloneNode();
                    
                        supTextHolderNodeClone.textContent = readyQueue[i]["burst time"];
                        subTextHolderNodeClone.textContent = readyQueue[i].process.substring(1);
                        divTextHolderNodeClone.append(readyQueue[i].process.charAt(0), supTextHolderNodeClone, subTextHolderNodeClone);
                        divTextHolderNodeClone.style.fontSize = "20px"
                        divNonRedCircleNodeClone.appendChild(divTextHolderNodeClone);
                    
                        divNonRedCircleNodeClone.style['grid-column-start'] = `${columnStart}`;
                        divNonRedCircleNodeClone.style['grid-column-end'] = `${columnEnd}`;
                        divNonRedCircleNodeClone.style['grid-row-start'] = `${i + 2}`;
                        divNonRedCircleNodeClone.style['grid-row-end'] = `${i + 3}`;
                    
                        ready.appendChild(divNonRedCircleNodeClone)
                    }
                }
        
                readyQueue.splice(indexOfObject, 1);
                
                burstTime--;
                columnStart++;
                columnEnd++;
                queueLength--;
                totalTime++;
            }
            else if(burstTime === 0 && readyQueue.length === 0 && array.length !== 0)
            {
                readyQueue.forEach((e) => {
                    let divNonRedCircleNodeClone = divNonRedCircle.cloneNode();
                    let divTextHolderNodeClone = divHolder.cloneNode();
                    let subTextHolderNodeClone = subElement.cloneNode();
                    let supTextHolderNodeClone = supElement.cloneNode();
                
                    supTextHolderNodeClone.textContent = e["burst time"];
                    subTextHolderNodeClone.textContent = e.process.substring(1);
                    divTextHolderNodeClone.append(e.process.charAt(0), supTextHolderNodeClone, subTextHolderNodeClone);
                    divTextHolderNodeClone.style.fontSize = "20px"
                    divNonRedCircleNodeClone.appendChild(divTextHolderNodeClone);
                
                    divNonRedCircleNodeClone.style['grid-column-start'] = `${columnStart}`;
                    divNonRedCircleNodeClone.style['grid-column-end'] = `${columnEnd}`;
                    divNonRedCircleNodeClone.style['grid-row-start'] = `${rowStart}`;
                    divNonRedCircleNodeClone.style['grid-row-end'] = `${rowEnd}`;
                
                    ready.appendChild(divNonRedCircleNodeClone)
                
                    rowStart++;
                    rowEnd++;
                })
                rowStart = 2
                rowEnd = 3;
                columnStart++;
                columnEnd++;
                totalTime++;
            }
            else if(burstTime !== 0)
            {
                appendRemaining(readyQueue, rowStart, rowEnd, columnStart, columnEnd, "SJF")
                burstTime--;
                totalTime++;
                columnStart++;
                columnEnd++;
            }
        }
    }

    if(algo === "SRTF")
    {
        const ready = document.querySelector('.srtf > .ready');
        const totalProcess = arrayLength;
        const SRTFQueue = [];
        let totalTime = array[0].arrive;
        let columnStart = Number(array[0].arrive) + 2;
        let columnEnd = Number(array[0].arrive) + 3;
        let processCompleted = 0;
        let holderQueueElement = null;
        let remainingTime = 0
        let tempHolder = {};
        let indexOfObject = 0;
        let smallestBurstTime = {};
        let divRedCircleNodeClone = divRedCircle.cloneNode();
        let divTextHolderNodeClone = divHolder.cloneNode();
        let subTextHolderNodeClone = subElement.cloneNode();
        let supTextHolderNodeClone = supElement.cloneNode();
        let rowStart = 0;
        let rowEnd = 0;
        array.forEach((e) => {
            e['appeared'] = false;
        })

        while(processCompleted !== totalProcess)
        {
            if(array.length !== 0 && totalTime >= array[0].arrive)
            {
                SRTFQueue.push(array.shift());
            }

            if(SRTFQueue.length >= 1)
            {
                smallestBurstTime = SRTFQueue.reduce((a, b) => {
                    return (a["burst time"] < b["burst time"]) ? a : b
                }, SRTFQueue[0])
                for(let i = 0; i < SRTFQueue.length; i++)
                {
                    if(SRTFQueue[i].process === smallestBurstTime.process)
                    {
                        indexOfObject = i;
                        break;
                    }
                }
                SRTFQueue.splice(indexOfObject, 1);

                if(holderQueueElement === null)
                {
                    holderQueueElement = smallestBurstTime;
                    holderQueueElement["appeared"] = false;
                    remainingTime = holderQueueElement["burst time"]
                }
                else if(remainingTime === 0 && holderQueueElement["burst time"] === 0)
                {
                    holderQueueElement = smallestBurstTime;
                    remainingTime = holderQueueElement["burst time"]
                    holderQueueElement["appeared"] = false;
                }
                else
                {
                    if(holderQueueElement["burst time"] > smallestBurstTime["burst time"])
                    {
                        holderQueueElement["burst time"] = remainingTime
                        tempHolder = holderQueueElement;
                        holderQueueElement = smallestBurstTime;
                        remainingTime = holderQueueElement["burst time"]
                        holderQueueElement["appeared"] = false;
                        SRTFQueue.push(tempHolder)
                    }
                    else
                    {
                        SRTFQueue.push(smallestBurstTime)
                    }
                }


                if(holderQueueElement["appeared"] === false)
                {
                    rowStart = indexOfObject + 2;
                    rowEnd = indexOfObject + 3;
                    divRedCircleNodeClone = divRedCircle.cloneNode();
                    divTextHolderNodeClone = divHolder.cloneNode();
                    subTextHolderNodeClone = subElement.cloneNode();
                    supTextHolderNodeClone = supElement.cloneNode();

                    subTextHolderNodeClone.textContent = holderQueueElement.process.substring(1)
                    supTextHolderNodeClone.textContent = holderQueueElement["burst time"]
                    divTextHolderNodeClone.append(holderQueueElement.process.charAt(0), supTextHolderNodeClone, subTextHolderNodeClone)
                    divTextHolderNodeClone.style.fontSize = "20px"

                    divRedCircleNodeClone.appendChild(divTextHolderNodeClone);

                    divRedCircleNodeClone.style["grid-row-start"] = `${rowStart}`
                    divRedCircleNodeClone.style["grid-row-end"] = `${rowEnd}`
                    divRedCircleNodeClone.style["grid-column-start"] = `${columnStart}`
                    divRedCircleNodeClone.style["grid-column-end"] = `${columnEnd}`

                    ready.appendChild(divRedCircleNodeClone);

                    holderQueueElement["appeared"] = true;
                }
                if(SRTFQueue.length !== 0)
                {
                    const SRTFQueueLength = SRTFQueue.length;
                    for(let i = 0; i < SRTFQueueLength; i++)
                    {
                        let divNonRedCircleNodeClone = divNonRedCircle.cloneNode();
                        let divTextHolderNodeClone = divHolder.cloneNode();
                        let subTextHolderNodeClone = subElement.cloneNode();
                        let supTextHolderNodeClone = supElement.cloneNode();
                    
                        supTextHolderNodeClone.textContent = SRTFQueue[i]["burst time"];
                        subTextHolderNodeClone.textContent = SRTFQueue[i].process.substring(1);
                        divTextHolderNodeClone.append(SRTFQueue[i].process.charAt(0), supTextHolderNodeClone, subTextHolderNodeClone);
                        divTextHolderNodeClone.style.fontSize = "20px"
                        divNonRedCircleNodeClone.appendChild(divTextHolderNodeClone);
                    
                        divNonRedCircleNodeClone.style['grid-column-start'] = `${columnStart}`;
                        divNonRedCircleNodeClone.style['grid-column-end'] = `${columnEnd}`;
    
                        if(i + 2 === rowStart && i + 3 === rowEnd)
                        {
                            divNonRedCircleNodeClone.style['grid-row-start'] = `${i + 3}`;
                            divNonRedCircleNodeClone.style['grid-row-end'] = `${i + 4}`;
                        }
                        else
                        {
                            divNonRedCircleNodeClone.style['grid-row-start'] = `${i + 2}`;
                            divNonRedCircleNodeClone.style['grid-row-end'] = `${i + 3}`;
                        }
                        
                        ready.appendChild(divNonRedCircleNodeClone)
                    }
                }
                rowStart = 0;
                rowEnd = 0;
            }
            if(remainingTime === 0 && SRTFQueue.length === 0 && array.length !== 0)
            {
                totalTime++;
                columnStart++;
                columnEnd++;
            }
            else if(remainingTime !== 0)
            {
                totalTime++
                holderQueueElement["burst time"]--
                remainingTime--
                columnStart++;
                columnEnd++;

                if(remainingTime === 0)
                {
                    processCompleted++;
                }
            }
        }
    }

    if(algo === "RR")
    {
        const ready = document.querySelector(`.algo.rr .ready`);
        const totalProcess = arrayLength;
        let processCompleted = 0;
        let shiftedObjectHolder = null;
        let tempHolder = {};
        let RRarrayLength = 0;
        let totalTime = array[0].arrive;
        let remainingTime = 0;
        let divRedCircleNodeClone = divRedCircle.cloneNode();
        let divTextHolderNodeClone = divHolder.cloneNode();
        let subTextHolderNodeClone = subElement.cloneNode();
        let supTextHolderNodeClone = supElement.cloneNode();
        let rowStart = 2;
        let rowEnd = 3;
        let columnStart = Number(array[0].arrive) + 2;
        let columnEnd = Number(array[0].arrive) + 3;
        const RRarray = array;          //better naming
        const RRQueue = [];

        RRarray.forEach((e) => {
            e["times"] = 0;
        })

        while(processCompleted !== totalProcess)
        {
            RRarrayLength = RRarray.length;
            if(RRarrayLength !== 0 && totalTime >= RRarray[0].arrive)
            {
                RRQueue.push(RRarray.shift());
            }

            if(RRQueue.length >= 1)
            {
                if(shiftedObjectHolder === null)
                {
                    shiftedObjectHolder = RRQueue.shift();
                    remainingTime = shiftedObjectHolder["burst time"]

                    divRedCircleNodeClone = divRedCircle.cloneNode();
                    divTextHolderNodeClone = divHolder.cloneNode();
                    subTextHolderNodeClone = subElement.cloneNode();
                    supTextHolderNodeClone = supElement.cloneNode();

                    subTextHolderNodeClone.textContent = shiftedObjectHolder.process.substring(1)
                    supTextHolderNodeClone.textContent = shiftedObjectHolder["burst time"]
                    divTextHolderNodeClone.append(shiftedObjectHolder.process.charAt(0), supTextHolderNodeClone, subTextHolderNodeClone)
                    divTextHolderNodeClone.style.fontSize = "20px"

                    divRedCircleNodeClone.appendChild(divTextHolderNodeClone);

                    divRedCircleNodeClone.style["grid-row-start"] = `${rowStart}`
                    divRedCircleNodeClone.style["grid-row-end"] = `${rowEnd}`
                    divRedCircleNodeClone.style["grid-column-start"] = `${columnStart}`
                    divRedCircleNodeClone.style["grid-column-end"] = `${columnEnd}`

                    ready.appendChild(divRedCircleNodeClone);

                    rowStart++;
                    rowEnd++;

                }
                else if(remainingTime === 0 && shiftedObjectHolder["burst time"] === 0)
                {
                    shiftedObjectHolder = RRQueue.shift();
                    remainingTime = shiftedObjectHolder["burst time"]

                    divRedCircleNodeClone = divRedCircle.cloneNode();
                    divTextHolderNodeClone = divHolder.cloneNode();
                    subTextHolderNodeClone = subElement.cloneNode();
                    supTextHolderNodeClone = supElement.cloneNode();

                    subTextHolderNodeClone.textContent = shiftedObjectHolder.process.substring(1)
                    supTextHolderNodeClone.textContent = shiftedObjectHolder["burst time"]
                    divTextHolderNodeClone.append(shiftedObjectHolder.process.charAt(0), supTextHolderNodeClone, subTextHolderNodeClone)
                    divTextHolderNodeClone.style.fontSize = "20px"

                    divRedCircleNodeClone.appendChild(divTextHolderNodeClone);

                    divRedCircleNodeClone.style["grid-row-start"] = `${rowStart}`
                    divRedCircleNodeClone.style["grid-row-end"] = `${rowEnd}`
                    divRedCircleNodeClone.style["grid-column-start"] = `${columnStart}`
                    divRedCircleNodeClone.style["grid-column-end"] = `${columnEnd}`

                    ready.appendChild(divRedCircleNodeClone);

                    rowStart++;
                    rowEnd++;
                }
                else
                {
                    if(shiftedObjectHolder["times"] === quantum)
                    {
                        shiftedObjectHolder["times"] = 0;
                        shiftedObjectHolder["burst time"] = remainingTime
                        tempHolder = shiftedObjectHolder;
                        shiftedObjectHolder = RRQueue.shift();
                        remainingTime = shiftedObjectHolder["burst time"]
                        RRQueue.push(tempHolder)

                        divRedCircleNodeClone = divRedCircle.cloneNode();
                        divTextHolderNodeClone = divHolder.cloneNode();
                        subTextHolderNodeClone = subElement.cloneNode();
                        supTextHolderNodeClone = supElement.cloneNode();

                        subTextHolderNodeClone.textContent = shiftedObjectHolder.process.substring(1)
                        supTextHolderNodeClone.textContent = shiftedObjectHolder["burst time"]
                        divTextHolderNodeClone.append(shiftedObjectHolder.process.charAt(0), supTextHolderNodeClone, subTextHolderNodeClone)
                        divTextHolderNodeClone.style.fontSize = "20px"

                        divRedCircleNodeClone.appendChild(divTextHolderNodeClone);

                        divRedCircleNodeClone.style["grid-row-start"] = `${rowStart}`
                        divRedCircleNodeClone.style["grid-row-end"] = `${rowEnd}`
                        divRedCircleNodeClone.style["grid-column-start"] = `${columnStart}`
                        divRedCircleNodeClone.style["grid-column-end"] = `${columnEnd}`

                        ready.appendChild(divRedCircleNodeClone);

                        rowStart++;
                        rowEnd++;
                    }
                }
            }
            else
            {
                if(shiftedObjectHolder["times"] === quantum && shiftedObjectHolder["burst time"] !== 0)
                {
                    divRedCircleNodeClone = divRedCircle.cloneNode();
                    divTextHolderNodeClone = divHolder.cloneNode();
                    subTextHolderNodeClone = subElement.cloneNode();
                    supTextHolderNodeClone = supElement.cloneNode();

                    subTextHolderNodeClone.textContent = shiftedObjectHolder.process.substring(1)
                    supTextHolderNodeClone.textContent = shiftedObjectHolder["burst time"]
                    divTextHolderNodeClone.append(shiftedObjectHolder.process.charAt(0), supTextHolderNodeClone, subTextHolderNodeClone)
                    divTextHolderNodeClone.style.fontSize = "20px"

                    divRedCircleNodeClone.appendChild(divTextHolderNodeClone);

                    divRedCircleNodeClone.style["grid-row-start"] = `${rowStart}`
                    divRedCircleNodeClone.style["grid-row-end"] = `${rowEnd}`
                    divRedCircleNodeClone.style["grid-column-start"] = `${columnStart}`
                    divRedCircleNodeClone.style["grid-column-end"] = `${columnEnd}`

                    ready.appendChild(divRedCircleNodeClone);

                    shiftedObjectHolder["times"] = 0;
                }
            }

            appendRemaining(RRQueue, rowStart, rowEnd, columnStart, columnEnd, "RR")

            
            if(remainingTime === 0 && RRQueue.length === 0 && RRarray.length !== 0)
            {
                totalTime++;
                columnStart++;
                columnEnd++;
            }
            else if(remainingTime !== 0)
            {
                shiftedObjectHolder["times"]++;
                shiftedObjectHolder["burst time"]--;
                remainingTime--;
                totalTime++;

                if(remainingTime === 0)
                {
                    processCompleted++;
                }

                columnStart++;
                columnEnd++;
                rowStart = 2;
                rowEnd = 3;
            }
        }
    }
}

function appendTable(array, quantum) 
{
    const table = document.querySelectorAll('.algo > table');
    const trTableElement = document.createElement('tr');
    const thTableElement = document.createElement('th');
    let trNodeClone;
    let thNodeClone;

    table.forEach((e) => {
        array.forEach((a) => {
            trNodeClone = trTableElement.cloneNode();
            trNodeClone.setAttribute("id", `${a.process}`)
            thNodeClone = thTableElement.cloneNode();
            thNodeClone.textContent = a.process;
            trNodeClone.appendChild(thNodeClone)
            e.appendChild(trNodeClone)
        })
        trNodeClone = trTableElement.cloneNode();
        trNodeClone.setAttribute("id", `avg`)
        thNodeClone = thTableElement.cloneNode();
        thNodeClone.textContent = "Avg.";
        trNodeClone.appendChild(thNodeClone)
        e.appendChild(trNodeClone)
    })
}

function calculateResultOfAlgorithms(process, algo, totalTime)
{
    const trTableElement = document.createElement('tr');
    const thTableElement = document.createElement('th');
    let thTATNodeClone;
    let thWTNodeClone;
    let thRTNodeClone;
    let totalTAT = 0;
    let totalWT = 0;
    let totalRT = 0;
    let TAT;
    let WT;
    let RT;
    let trQuery;

    if(algo === "FCFS")
    {
        const table = document.querySelector('.algo.fcfs > table');
        const FCFSarray = process;
        const FCFSqueue = [];
        let burstTime = 0;
        let shiftedObjectHolder = null;
        let queueLength = arrayLength;

        while(queueLength !== 0)
        {
            if(FCFSarray.length !== 0 && totalTime >= FCFSarray[0].arrive)
            {
                FCFSqueue.push(FCFSarray.shift())
            }

            if(burstTime === 0 && FCFSqueue.length >= 1)
            {
                if(burstTime === 0)
                {
                    shiftedObjectHolder = FCFSqueue.shift();
                    burstTime += shiftedObjectHolder["burst time"];
                    burstTime--
                    totalTime++;

                    if(burstTime === 0)
                    {
                        trQuery = table.querySelector(`#${shiftedObjectHolder.process}`)

                        TAT = totalTime - shiftedObjectHolder.arrive
                        totalTAT += TAT
                        thTATNodeClone = thTableElement.cloneNode();
                        thTATNodeClone.textContent = `${TAT}`
                            
                        WT = TAT - shiftedObjectHolder["burst time"]
                        totalWT += WT

                        thWTNodeClone = thTableElement.cloneNode();
                        thWTNodeClone.textContent = `${WT}`

                        trQuery.append(thWTNodeClone, thTATNodeClone)

                        queueLength--;
                    }
                }
            }

            if(burstTime === 0 && FCFSqueue.length === 0 && FCFSarray.length !== 0)
            {
                totalTime++;
            }
            if(burstTime !== 0)
            {
                totalTime++;
                burstTime--;

                if(burstTime === 0)
                {
                    trQuery = table.querySelector(`#${shiftedObjectHolder.process}`)

                    TAT = totalTime - shiftedObjectHolder.arrive
                    totalTAT += TAT
                    thTATNodeClone = thTableElement.cloneNode();
                    thTATNodeClone.textContent = `${TAT}`
                    
                    WT = TAT - shiftedObjectHolder["burst time"]
                    totalWT += WT

                    thWTNodeClone = thTableElement.cloneNode();
                    thWTNodeClone.textContent = `${WT}`

                    trQuery.append(thWTNodeClone, thTATNodeClone)

                    queueLength--;
                }
            }
        }
        trQuery = table.querySelector('#avg')

        thTATNodeClone = thTableElement.cloneNode();
        thTATNodeClone.textContent = `${(totalTAT / arrayLength).toFixed(2)}`
        thWTNodeClone = thTableElement.cloneNode();
        thWTNodeClone.textContent = `${(totalWT / arrayLength).toFixed(2)}`

        trQuery.append(thWTNodeClone, thTATNodeClone)
    }

    if(algo === "SJF")
    {
        const table = document.querySelector('.algo.sjf > table');
        const SJFarray = process;
        const readyQueue = [];
        let holderQueueElement = null;
        let queueLength = arrayLength;
        let burstTime = 0;

        while(queueLength !== 0)
        {
            if(SJFarray.length !== 0 && totalTime >= SJFarray[0].arrive)
            {
                readyQueue.push(SJFarray.shift())
            }
            if(burstTime === 0 && readyQueue.length >= 1)
            {
                holderQueueElement = readyQueue.reduce((a, b) => {
                                            return (a["burst time"] < b["burst time"]) ? a : b;
                                        }, readyQueue[0]);
                                    
                for(let i = 0; i < readyQueue.length; i++)
                {
                    if(readyQueue[i].process === holderQueueElement.process)
                    {
                        indexOfObject = i;
                        break;
                    }
                }

                burstTime += holderQueueElement["burst time"];
        
                readyQueue.splice(indexOfObject, 1);
                
                burstTime--;
                totalTime++;

                if(burstTime === 0)
                {
                    trQuery = table.querySelector(`#${holderQueueElement.process}`)

                    TAT = totalTime - holderQueueElement.arrive
                    totalTAT += TAT
                    thTATNodeClone = thTableElement.cloneNode();
                    thTATNodeClone.textContent = `${TAT}`
                            
                    WT = TAT - holderQueueElement["burst time"]
                    totalWT += WT

                    thWTNodeClone = thTableElement.cloneNode();
                    thWTNodeClone.textContent = `${WT}`

                    trQuery.append(thWTNodeClone, thTATNodeClone)

                    queueLength--;
                }
            }

            if(burstTime === 0 && readyQueue.length === 0 && SJFarray.length !== 0)
            {
                totalTime++;
            }
            if(burstTime !== 0)
            {
                totalTime++;
                burstTime--;

                if(burstTime === 0)
                {
                    trQuery = table.querySelector(`#${holderQueueElement.process}`)

                    TAT = totalTime - holderQueueElement.arrive
                    totalTAT += TAT
                    thTATNodeClone = thTableElement.cloneNode();
                    thTATNodeClone.textContent = `${TAT}`
                    
                    WT = TAT - holderQueueElement["burst time"]
                    totalWT += WT

                    thWTNodeClone = thTableElement.cloneNode();
                    thWTNodeClone.textContent = `${WT}`

                    trQuery.append(thWTNodeClone, thTATNodeClone)

                    queueLength--;
                }
            }
        }
        trQuery = table.querySelector('#avg')

        thTATNodeClone = thTableElement.cloneNode();
        thTATNodeClone.textContent = `${(totalTAT / arrayLength).toFixed(2)}`
        thWTNodeClone = thTableElement.cloneNode();
        thWTNodeClone.textContent = `${(totalWT / arrayLength).toFixed(2)}`

        trQuery.append(thWTNodeClone, thTATNodeClone)
    }

    if(algo === "SRTF")
    {
        const table = document.querySelector('.algo.srtf > table');
        const SRTFarray = process;
        const SRTFQueue = [];
        const totalProcess = arrayLength;
        let processCompleted = 0;
        let holderQueueElement = null;
        let remainingTime = 0
        let tempHolder = {};
        let indexOfObject = 0;
        let smallestBurstTime = {};

        SRTFarray.forEach((e) => {
            e["input burst time"] = e["burst time"]
            e["first picked"] = 0;
            e["picked yet"] = false;
        })

        while(processCompleted !== totalProcess)
        {
            if(SRTFarray.length !== 0 && totalTime >= SRTFarray[0].arrive)
            {
                SRTFQueue.push(SRTFarray.shift());
            }

            if(SRTFQueue.length >= 1)
            {
                smallestBurstTime = SRTFQueue.reduce((a, b) => {
                    return (a["burst time"] < b["burst time"]) ? a : b
                }, SRTFQueue[0])
                for(let i = 0; i < SRTFQueue.length; i++)
                {
                    if(SRTFQueue[i].process === smallestBurstTime.process)
                    {
                        indexOfObject = i;
                        break;
                    }
                }
                SRTFQueue.splice(indexOfObject, 1);

                if(holderQueueElement === null)
                {
                    holderQueueElement = smallestBurstTime;
                    remainingTime = holderQueueElement["burst time"]

                    if(holderQueueElement["picked yet"] === false)
                    {
                        holderQueueElement["first picked"] = totalTime
                        holderQueueElement["picked yet"] = true;
                    }
                }
                else if(remainingTime === 0 && holderQueueElement["burst time"] === 0)
                {
                    holderQueueElement = smallestBurstTime;
                    remainingTime = holderQueueElement["burst time"];

                    if(holderQueueElement["picked yet"] === false)
                    {
                        holderQueueElement["first picked"] = totalTime
                        holderQueueElement["picked yet"] = true;
                    }
                }
                else
                {
                    if(holderQueueElement["burst time"] > smallestBurstTime["burst time"])
                    {
                        holderQueueElement["burst time"] = remainingTime
                        tempHolder = holderQueueElement;
                        holderQueueElement = smallestBurstTime;
                        remainingTime = holderQueueElement["burst time"]
                        if(holderQueueElement["picked yet"] === false)
                        {
                            holderQueueElement["first picked"] = totalTime
                            holderQueueElement["picked yet"] = true;
                        }
                        SRTFQueue.push(tempHolder)
                    }
                    else
                    {
                        SRTFQueue.push(smallestBurstTime)
                    }
                }
            }
            if(remainingTime === 0 && SRTFQueue.length === 0 && SRTFarray.length !== 0)
            {
                totalTime++;
            }
            else if(remainingTime !== 0)
            {
                totalTime++;
                holderQueueElement["burst time"]--;
                remainingTime--;

                if(remainingTime === 0)
                {
                    processCompleted++;

                    trQuery = table.querySelector(`#${holderQueueElement.process}`)

                    RT = holderQueueElement["first picked"] - holderQueueElement.arrive
                    totalRT += RT
                    thRTNodeClone = thTableElement.cloneNode();
                    thRTNodeClone.textContent = `${RT}`

                    TAT = totalTime - holderQueueElement.arrive
                    totalTAT += TAT
                    thTATNodeClone = thTableElement.cloneNode();
                    thTATNodeClone.textContent = `${TAT}`
                    
                    WT = TAT - holderQueueElement["input burst time"]
                    totalWT += WT

                    thWTNodeClone = thTableElement.cloneNode();
                    thWTNodeClone.textContent = `${WT}`

                    trQuery.append(thRTNodeClone, thWTNodeClone, thTATNodeClone)
                }
            }
        }
        trQuery = table.querySelector('#avg')

        thRTNodeClone = thTableElement.cloneNode();
        thRTNodeClone.textContent = `${(totalRT / arrayLength).toFixed(2)}`
        thTATNodeClone = thTableElement.cloneNode();
        thTATNodeClone.textContent = `${(totalTAT / arrayLength).toFixed(2)}`
        thWTNodeClone = thTableElement.cloneNode();
        thWTNodeClone.textContent = `${(totalWT / arrayLength).toFixed(2)}`

        trQuery.append(thRTNodeClone, thWTNodeClone, thTATNodeClone)
    }

    if(algo === "RR")
    {
        const table = document.querySelector('.algo.rr > table');
        const RRarray = process;
        const RRQueue = [];
        const totalProcess = arrayLength;
        let processCompleted = 0;
        let shiftedObjectHolder = null;
        let remainingTime = 0;
        let RRarrayLength;

        RRarray.forEach((e) => {
            e["times"] = 0;
            e["input burst time"] = e["burst time"];
            e["first picked"] = 0;
            e["picked yet"] = false;
        })

        while(processCompleted !== totalProcess)
        {
            RRarrayLength = RRarray.length;
            if(RRarrayLength !== 0 && totalTime >= RRarray[0].arrive)
            {
                RRQueue.push(RRarray.shift());
            }

            if(RRQueue.length >= 1)
            {
                if(shiftedObjectHolder === null)
                {
                    shiftedObjectHolder = RRQueue.shift();
                    remainingTime = shiftedObjectHolder["burst time"]
                    if(shiftedObjectHolder["picked yet"] === false)
                    {
                        shiftedObjectHolder["first picked"] = totalTime;
                        shiftedObjectHolder["picked yet"] = true;
                    }
                }
                else if(remainingTime === 0 && shiftedObjectHolder["burst time"] === 0)
                {
                    shiftedObjectHolder = RRQueue.shift();
                    remainingTime = shiftedObjectHolder["burst time"]
                    if(shiftedObjectHolder["picked yet"] === false)
                    {
                        shiftedObjectHolder["first picked"] = totalTime;
                        shiftedObjectHolder["picked yet"] = true;
                    }
                }
                else
                {
                    if(shiftedObjectHolder["times"] === quantum)
                    {
                        shiftedObjectHolder["times"] = 0;
                        shiftedObjectHolder["burst time"] = remainingTime
                        tempHolder = shiftedObjectHolder;
                        shiftedObjectHolder = RRQueue.shift();
                        remainingTime = shiftedObjectHolder["burst time"]
                        if(shiftedObjectHolder["picked yet"] === false)
                        {
                            shiftedObjectHolder["first picked"] = totalTime;
                            shiftedObjectHolder["picked yet"] = true;
                        }
                        RRQueue.push(tempHolder)
                    }
                }
            }
            if(remainingTime === 0 && RRQueue.length === 0 && RRarray.length !== 0)
            {
                totalTime++;
            }
            else if(remainingTime !== 0)
            {
                shiftedObjectHolder["times"]++;
                shiftedObjectHolder["burst time"]--;
                remainingTime--;
                totalTime++;

                if(remainingTime === 0)
                {
                    processCompleted++;

                    trQuery = table.querySelector(`#${shiftedObjectHolder.process}`)

                    RT = shiftedObjectHolder["first picked"] - shiftedObjectHolder.arrive
                    totalRT += RT
                    thRTNodeClone = thTableElement.cloneNode();
                    thRTNodeClone.textContent = `${RT}`

                    TAT = totalTime - shiftedObjectHolder.arrive
                    totalTAT += TAT
                    thTATNodeClone = thTableElement.cloneNode();
                    thTATNodeClone.textContent = `${TAT}`
                    
                    WT = TAT - shiftedObjectHolder["input burst time"]
                    totalWT += WT

                    thWTNodeClone = thTableElement.cloneNode();
                    thWTNodeClone.textContent = `${WT}`

                    trQuery.append(thRTNodeClone, thWTNodeClone, thTATNodeClone)
                }
            }
        }
        trQuery = table.querySelector('#avg')

        thRTNodeClone = thTableElement.cloneNode();
        thRTNodeClone.textContent = `${(totalRT / arrayLength).toFixed(2)}`
        thTATNodeClone = thTableElement.cloneNode();
        thTATNodeClone.textContent = `${(totalTAT / arrayLength).toFixed(2)}`
        thWTNodeClone = thTableElement.cloneNode();
        thWTNodeClone.textContent = `${(totalWT / arrayLength).toFixed(2)}`

        trQuery.append(thRTNodeClone, thWTNodeClone, thTATNodeClone)
    }
}

function FCFS(array)
{
    appendProcessToReadyQueue(JSON.parse(JSON.stringify(array)), "FCFS");
    drawMultipleVerticalLinesOnProgressAxis(JSON.parse(JSON.stringify(array)), array[0].arrive, "FCFS");
    drawHorizontalLineOnProgressAxis(JSON.parse(JSON.stringify(array)), array[0].arrive, "FCFS");
    calculateResultOfAlgorithms(JSON.parse(JSON.stringify(array)), "FCFS", array[0].arrive);
}

function SJF(array)
{
    appendProcessToReadyQueue(JSON.parse(JSON.stringify(array)), "SJF");
    drawMultipleVerticalLinesOnProgressAxis(JSON.parse(JSON.stringify(array)), array[0].arrive, "SJF")
    drawHorizontalLineOnProgressAxis(JSON.parse(JSON.stringify(array)), array[0].arrive, "SJF")
    calculateResultOfAlgorithms(JSON.parse(JSON.stringify(array)), "SJF", array[0].arrive);
}

function SRTF(array)
{
    appendProcessToReadyQueue(JSON.parse(JSON.stringify(array)), "SRTF");
    drawMultipleVerticalLinesOnProgressAxis(JSON.parse(JSON.stringify(array)), array[0].arrive, "SRTF");
    drawHorizontalLineOnProgressAxis(JSON.parse(JSON.stringify(array)), array[0].arrive, "SRTF");
    calculateResultOfAlgorithms(JSON.parse(JSON.stringify(array)), "SRTF", array[0].arrive);
}

function RR(array)
{
    appendProcessToReadyQueue(JSON.parse(JSON.stringify(array)), "RR");
    drawMultipleVerticalLinesOnProgressAxis(JSON.parse(JSON.stringify(array)), array[0].arrive, "RR");
    drawHorizontalLineOnProgressAxis(JSON.parse(JSON.stringify(array)), array[0].arrive, "RR")
    calculateResultOfAlgorithms(JSON.parse(JSON.stringify(array)), "RR", array[0].arrive);
}
