tag = document.createElement("script");
tag.src = "https://code.jquery.com/jquery-3.5.1.slim.min.js";
tag.integrity = "sha256-4+XzXVhsDmqanXGHaHvgh1gMQKX40OUvDEBTu8JcmNs=";
tag.crossOrigin = "anonymous"
tag.onload = function(){
    const maxMegaClippers = 125;
    const mainInterval = 25;
    const decideEvery = 500;
    const priceBufferRatio = 5;
    const wireBufferRatio = 10;
    const priceEasing = 5;
    debugLevel = localStorage.getItem("debugLevel") || 0; // 1 - infrequent clicks, 2 - frequent clicks, 3 - every click
    actionTaken = false;
    main = null;
    lastDecide = Date.now();
    lastUnsoldClips = 0;    
    priceDown = 0;
    priceUp = 0;
    maxWireCost = parseInt($("#wireCost").html().replace(",",""));
    autoSaves = [];
    autoPlay = localStorage.getItem("autoPlay");
    $("#topDiv").before("<div id='automateDiv' />")
    $("#automateDiv").append("<span id='autoPlayLabel'>Auto Play: </span>")
        .append("<select id='autoPlay'><option value='off'>OFF</option><option value='on'>ON</option></select>")
        .append("<button id='btnReset'>Reset</button>")
        .append("<br />")
        .append("<span id='autoSaveLabel'>Auto Saves: </span>")
        .append("<select id='autoSaves'></select>")
        .append("<button id='btnLoadSave'>Load</button>")
        .append("<button id='btnAutoSave'>Save</button>")
        .append("<button id='btnDeleteSave'>Delete</button>")
        .append("<br />")
        .append("<span id='debugLabel'>Debug Level: </span>")
        .append("<select id='debugLevel'><option value='0' selected='selected'>Off</option><option value='1'>Level 1</option><option value='2'>Level 2</option><option value='3'>Level 3</option></select>")
        .append("<br /><br />");
    if(localStorage.getItem("autoSaves") != null){
        autoSaves=JSON.parse(localStorage.getItem("autoSaves"));
        updateAutoSaveList();
    }
    if(autoPlay){
        main = setInterval(run,mainInterval);
        $("#autoPlay").val('on');
    }else{
        $("#autoPlay").val('off');
    }
    $("#debugLevel").val(debugLevel).change(function(){
        debugLevel = $(this).val();
        localStorage.setItem("debugLevel",$(this).val());
    });
    $("#btnAutoSave").click(function(){
        doAutoSave();
    });
    $("#btnLoadSave").click(function(){
        doLoadSave();
    });
    $("#btnDeleteSave").click(function(){
        doDeleteSave();
    });
    $("#btnReset").click(function(){
        clearInterval(main);
        localStorage.removeItem("autoSaves");
        reset();
    });
    $("#autoPlay").change(function(){
        clearInterval(main);
        if($(this).val() == 'on'){            
            main = setInterval(run,mainInterval);
        }
        localStorage.setItem("autoPlay",$(this).val());
    })

    function run(){
        cps = parseInt($("#clipmakerRate").html().replace(",",""));
        priceBuffer = Math.max(priceBufferRatio, cps * priceBufferRatio);
        if(megaClipperLevel > 1){
            priceBuffer *= 1.0 - (megaClipperLevel / maxMegaClippers);
        }
        wireBuffer = Math.max(wireBufferRatio, cps * wireBufferRatio);
        maxWireCost = Math.max(wireCost, maxWireCost);
        makeClip();
        doCompute();
        launchProbe();
        if(Date.now() - lastDecide > decideEvery){
            lastDecide = Date.now();
            actionTaken = false;
            if(!actionTaken) withdraw();
            if(!actionTaken) buyWire();
            if(!actionTaken) setPrice();
            if(!actionTaken) doProjects();
            if(!actionTaken) newTourney();
            if(!actionTaken) runTourney();            
            if(!actionTaken) upgradeInvestmentEngine();
            if(!actionTaken) invest();
            if(!actionTaken) addPower();
            if(!actionTaken) adjustSlider();
            if(!actionTaken) addProcessors();
            if(!actionTaken) addMemory();
            if(!actionTaken) addHarvesterDrone();
            if(!actionTaken) addWireDrone();
            if(!actionTaken) addFactory();
            if(!actionTaken) addBattery();
            if(!actionTaken) exploreSpace();
            if(!actionTaken) increaseMaxTrust();
            if(!actionTaken) increaseProbeTrust();
            if(!actionTaken) probeDesign();
            if(!actionTaken) buyMegaClipper();
            if(!actionTaken) buyAutoClipper();
            if(!actionTaken) increaseMarketing();
            if(!actionTaken) synchronizeSwarm();
            if(!actionTaken) choosePrestige();
        }
        // BEGIN fastclick functions
        function makeClip(){
            if(cps < 1000){
                clickBtn("MakePaperclip", 3, true);
            }            
        }
        function doCompute(){
            if(qFlag){
                chips = [
                    "#qChip0",
                    "#qChip1",
                    "#qChip2",
                    "#qChip3",
                    "#qChip4",
                    "#qChip5",
                    "#qChip6",
                    "#qChip7",
                    "#qChip8",
                    "#qChip9",
                ]
                score = 0;
                chips.forEach(chip => {
                    score += parseFloat($(chip).attr("style").replace("opacity: ","").slice(0,-1))
                });            
                if(qComputing && score >= 0.00001){
                    clickBtn("Qcompute", 3, true);
                }
            }
        }
        function launchProbe(){
            if(unusedClips >= probeCost){
                clickBtn("MakeProbe", 3, true);
            }            
        }
        // END fastclick functions
        // BEGIN slowclick functions
        function setPrice(){
            if(humanFlag){
                if(clips < 300 && margin > 0.06){
                    clickBtn("LowerPrice");
                }
                else if(cps > unsoldClips){
                    clickBtn("RaisePrice");
                }
                else if
                (
                    unsoldClips > priceBuffer 
                    && (unsoldClips > lastUnsoldClips || unsoldClips > priceBuffer * 2)
                ){
                    priceDown++
                    priceUp = 0;
                    if(priceDown >= priceEasing && margin >= 0.02){
                        clickBtn("LowerPrice");
                        priceDown = 0;
                    }                
                }else if (cps > 1 && demand > 5){
                    priceUp++
                    priceDown = 0;
                    if(priceUp >= priceEasing){
                        clickBtn("RaisePrice");
                        priceUp = 0;
                    }
                }
                lastUnsoldClips = unsoldClips;
            }
		}
		function buyWire(){
            if(humanFlag && (!wireBuyerFlag || !wireBuyerStatus) && (wire < wireBuffer || wire < 1)
            ){                
                clickBtn("BuyWire");
            }
		}
		function buyAutoClipper(){
            if(autoClipperFlag && clipmakerLevel < 75 && wire > wireBuffer
                && funds + (unsoldClips * 0.02) > (maxWireCost + clipperCost)                
            ){
                if(marketingLvl == 1 && clipmakerLevel < 40
                    || clipmakerLevel >= 40 && marketingLvl >1
                ){
                    clickBtn("MakeClipper");
                }
            }
		}
		function buyMegaClipper(){
            if(megaClipperFlag
                && (megaClipperLevel < 40 || avgRev * 25 > megaClipperCost)
                && funds + (unsoldClips * 0.02) > (maxWireCost + megaClipperCost) 
                && megaClipperLevel <=120
            ){
                clickBtn("MakeMegaClipper");
            }
		}
		function increaseMarketing(){
            if(humanFlag
                && funds + (unsoldClips * 0.04) > maxWireCost + adCost
                && clipmakerLevel >= 40
                && marketingLvl < 15
            ){
                clickBtn("ExpandMarketing");
            }
		}
		function doProjects(){
            projectPriority = {
                1:[
                    2    // Creativity
                ],
                2:[
                    5,   // +1 trust
                    13,  // +1 trust
                    14,  // +1 trust
                    15,  // +1 trust
                    16,  // +1 trust
                    19   // +1 trust
                ],
                3:[
                    38,  // Rev Tracker
                    0,   // Improved AutoClippers 1
                    6,   // Improved Wire 1
                    45,  // Quantum Computing
                ],
                4:[
                    46,  // Photonic Chips
                ],
                5:[
                    11,  // Improved Marketing 1
                    3,   // Improved AutoClippers 2
                    7,   // Improved Wire 2
                    12,  // Improved Marketing 2
                    4,   // Improved AutoClippers 2
                    17,  // Improved AutoClippers 3
                    26,  // Wire buyer
                    8,   // Improved Wire 3
                    9,   // Improved Wire 4
                    20,  // Yomi
                    21,  // Investment
                    27,  // Improved Marketing 3
                    22,  // Mega Clippers
                    23,  // Improved Mega Clippers 1
                    24,  // Improved Mega Clippers 2
                    47,  // A100 Yomi strategy
                    48,  // B100 Yomi strategy
                    49,  // GREEDY Yomi strategy
                    25,  // Improved Mega Clippers 3
                    30,  // Improved Marketing 4
                    50,  // GENEROUS Yomi strategy
                    34,  // Trust +20
                    31,  // Trust +10
                    33,  // Trust +15
                    51,  // MINIMAX Yomi strategy
                    52,  // TIT FOR TAT Yomi strategy
                    53,  // BEAT LAST Yomi strategy
                    32,  // Trust +12
                    28,  // HypnoDrones
                    10,  // Improved Wire 5
                    36,  // Hostile Takeover
                    37,  // Full Monopoly
                    42,  // A Token of Goodwill...
                    43,  // Another Token of Goodwill...
                    29,  // Release HypnoDrones
                ],
                6:[
                    18,  //  Manufacturing
                    66,  //  Power Grid
                    35,  //  Wire Production
                    40,  //  Wire Drones
                    39,  //  Harvester Production
                    41,  //  Clip Factories
                    64,  //  Momentum
                    65,  //  Swarm Computing
                    57,  //  Drone Improvement 1
                    54,  //  Factory Improvement 1
                    55,  //  Factory Improvement 2
                    58,  //  Drone Improvement 2
                    59,  //  Drone Improvement 3
                    56,  //  Factory Improvement 3
                    
                ],
                7:[ 
                    44,  // Space Exploration
                    61,  // Theory of Mind
                    60,  // Auto Tourney                    
                    67,  // Bonus Yomi
                    68,  // Hazard reduction
                    69,  // Reboot the Swarm
                    70,  // Combat
                    62,  // Speed Buffs Combat
                    63,  // Increase Probe Trust
                    71,  // 50,000 Honor
                    72,  // 10,000 Honor
                    73,  // Bonus Honor for Victory
                    75,  // End Game 1
                    76,  // End Game 2
                    77,  // End Game 3
                    78,  // End Game 4
                    79,  // End Game 5
                    80,  // End Game 6
                    81,  // End Game 7
                    82,  // Accept Restart
                ]
            };
            phaseComplete = true;
            $.each(projectPriority,function(i,phaseProjects) {
                if(phaseComplete && !actionTaken){
                    phaseProjects.every(function(projectId){
                        if(projectId == 29 && (memory + processors) < 100){
                            phaseComplete = false;
                            return false;
                        }
                        project = projects[projectId];
                        projectBtn = $("#" + project.id);
                        doProject(project);
                        phaseComplete = (project.flag && (!projectBtn.is(":visible") || phaseProjects.length == 1));
                        return !actionTaken;
                    })
                }
            })
		}
		function addProcessors(){
            if(compFlag
                && (
                    processors < 5
                    || (processors < 30 && memory >= 55)
                    || (memory / processors > 2 && memory >= 125)
                    || (memory >=300 && processors < 1000)
                )
            ){
                clickBtn("AddProc");
            }            
		}
		function addMemory(){
            if(compFlag
                && (
                    (processors >= 5 && memory < 55 && projects[19].flag)
                    || (processors >= 30 && memory < 125)
                    || (memory / processors <= 2 && memory < 300 && memory >= 125)
                )
            ){
                clickBtn("AddMem");
            }            
		}
		function newTourney(){
            if(strategyEngineFlag && operations >= standardOps){
                if($("#stratPicker option[value='7']").length > 0){
                    $("#stratPicker").val("7");
                }
                else if($("#stratPicker option[value='3']").length > 0){
                    $("#stratPicker").val("3");
                }
                else if($("#stratPicker option[value='1']").length > 0){
                    $("#stratPicker").val("1");
                }
                else{
                    $("#stratPicker").val("0");
                }
                clickBtn("NewTournament");
            }
        }
        function runTourney(){
            if(strategyEngineFlag){
                clickBtn("RunTournament");
            }
        }
		function upgradeInvestmentEngine(){
            if(investmentEngineFlag && investLevel < 7){
                clickBtn("ImproveInvestments");
            }
		}
		function withdraw(){
            if(investmentEngineFlag){
                moneyProjects = [ 36, 37, 42, 43 ];
                moneyProjects.forEach(function(moneyProject){
                    projectCost = parseInt(projects[moneyProject].priceTag.replace(/.*\$/,"").replace(/,/g,"").replace(")",""));
                    project = projects[moneyProject];
                    projectBtn = $("#" + project.id);
                    if(
                        (
                            $(projectBtn).is(":visible") 
                            && (bankroll + funds) > projectCost
                            && funds < projectCost
                        )
                        || funds + portTotal > 512000000
                    ){
                        clickBtn("Withdraw");
                    }
                })
            }
        }            
        function invest(){    
            if(investmentEngineFlag && investLevel > 3 && megaClipperLevel >= 40
                &&  (portTotal < 1 || funds * 20 > portTotal)
                &&  funds + portTotal < 512000000
            ){
                $("#investStrat").val("hi");
                clickBtn("Invest");
            }
		}
		function addPower(){
            if(project127.flag == 1 && spaceFlag == 0){
                powerConsumption = parseInt($("#powerConsumptionRate").html().replace(",",""));
                powerProduction = parseInt($("#powerProductionRate").html().replace(",",""));
                powerRatio = (availableMatter > 1 ? 0.9 : 0.6);
                if(powerConsumption >= (powerProduction * powerRatio) 
                    || powerProduction == 0
                    || powerConsumption > powerProduction - 150
                ){
                    clickBtn("Farmx100") || clickBtn("Farmx10") || clickBtn("MakeFarm");
                }
            }
		}
		function addBattery(){
            if(project127.flag == 1 && spaceFlag == 0){
                powerConsumption = parseInt($("#powerConsumptionRate").html().replace(",",""));
                powerProduction = parseInt($("#powerProductionRate").html().replace(",",""));
                if(batteryLevel < 1000 && batteryCost * 40 < unusedClips && powerProduction > powerConsumption){
                    console.log("add battery");
                    if(batteryLevel < 900){
                        clickBtn("Batteryx100") || clickBtn("Batteryx10") || clickBtn("MakeBattery");
                    }else if(batteryLevel < 990){
                        clickBtn("Batteryx10") || clickBtn("MakeBattery");
                    }else{
                        clickBtn("MakeBattery");
                    }
                    
                }
            }
		}
		function addFactory(){
            if(factoryFlag){
                powerConsumption = parseInt($("#powerConsumptionRate").html().replace(",",""));
                powerProduction = parseInt($("#powerProductionRate").html().replace(",",""));
                if(powerConsumption < powerProduction - 150 || factoryLevel < 1){
                    clickBtn("MakeFactory");
                }
            }
		}
		function addHarvesterDrone(){
            if(harvesterFlag){
                powerConsumption = parseInt($("#powerConsumptionRate").html().replace(",",""));
                powerProduction = parseInt($("#powerProductionRate").html().replace(",",""));
                if((acquiredMatter < 1 && availableMatter > 1  && powerConsumption < powerProduction)
                    || harvesterLevel < 1
                ){
                    clickBtn("Harvesterx1000") || clickBtn("Harvesterx100") || clickBtn("Harvesterx10") || clickBtn("MakeHarvester");
                }
            }
		}
		function addWireDrone(){
            if(wireDroneFlag){
                powerConsumption = parseInt($("#powerConsumptionRate").html().replace(",",""));
                powerProduction = parseInt($("#powerProductionRate").html().replace(",",""));
                if((wire < 1 && acquiredMatter > 1 && availableMatter > 1 && powerConsumption < powerProduction)
                    || wireDroneLevel < 1
                ){
                    clickBtn("WireDronex1000") || clickBtn("WireDronex100") || clickBtn("WireDronex10") || clickBtn("MakeWireDrone");
                }
            }
		}
		function adjustSlider(){
            if(swarmFlag){
                if(!spaceFlag){
                    if(factoryLevel <= 5){
                        sliderVal = 100;
                    }else if(factoryLevel < 50){
                        sliderVal = 150;
                    }else if(factoryLevel < 100){
                        sliderVal = 190;
                    }else{
                        sliderVal = 195;
                    }
                    if(farmLevel < 30){
                        sliderVal = 0;
                    }
                }else{
                    sliderVal = 150;
                }
                
                // sliderVal = Math.min(sliderVal,190)
                if($("#slider").val() != sliderVal){
                    $("#slider").val(sliderVal);
                    actionTaken = true;
                    if(debugLevel >= 1){
                        console.log("SliderAdjust: " + sliderVal);
                    }
                }                
            }
		}
		function exploreSpace(){
            if(wireProductionFlag && availableMatter < 1 && storedPower > 9999999 && operations > 120000){
                clickBtn("FactoryReboot") || clickBtn("HarvesterReboot") || clickBtn("WireDroneReboot");
            }
		}
		function increaseProbeTrust(){
            if(spaceFlag){
                clickBtn("IncreaseProbeTrust");
            }
        }
        function increaseMaxTrust(){
            if(spaceFlag){
                clickBtn("IncreaseMaxTrust");
            }
        }
        function synchronizeSwarm(){
            if(spaceFlag){
                clickBtn("SynchSwarm");
            }
        }
		function probeDesign(){
            if(spaceFlag){
                probeConfig = {
                    speed:0,
                    nav:0,
                    rep:0,
                    haz:Math.min(Math.round(probeTrust * 0.3),6),
                    fac:0,
                    harv:0,
                    wire:0,
                    combat:0
                };
                probeTrustAvailable = probeTrust - probeConfig.haz;
                spaceExplored = Math.round($("#colonizedDisplay").html());
                if(availableMatter < 1 && spaceExplored < 100){
                    probeConfig.speed = 1;
                    probeTrustAvailable --;
                    probeConfig.nav = 1;
                    probeTrustAvailable --;
                }else if(acquiredMatter < 1){
                    probeConfig.harv = 1;
                    probeTrustAvailable --;
                }else if(wire < 1){
                    probeConfig.wire = 1;
                    probeTrustAvailable --;
                }else{
                    probeConfig.fac = 1;
                    probeTrustAvailable --;
                }
                if(project131.flag){
                    probeConfig.combat = Math.min(Math.round(probeTrust * 0.165),5);
                    probeTrustAvailable -= probeConfig.combat;
                }
                probeConfig.rep = probeTrustAvailable;
                // console.log(probeConfig);
                !actionTaken && probeRep < probeConfig.rep && clickBtn("RaiseProbeRep");
                !actionTaken && probeRep > probeConfig.rep && clickBtn("LowerProbeRep");
                !actionTaken && probeHaz < probeConfig.haz && clickBtn("RaiseProbeHaz");
                !actionTaken && probeHaz > probeConfig.haz && clickBtn("LowerProbeHaz");
                !actionTaken && probeNav < probeConfig.nav && clickBtn("RaiseProbeNav");
                !actionTaken && probeNav > probeConfig.nav && clickBtn("LowerProbeNav");
                !actionTaken && probeSpeed < probeConfig.speed && clickBtn("RaiseProbeSpeed");
                !actionTaken && probeSpeed > probeConfig.speed && clickBtn("LowerProbeSpeed");
                !actionTaken && probeFac < probeConfig.fac && clickBtn("RaiseProbeFac");
                !actionTaken && probeFac > probeConfig.fac && clickBtn("LowerProbeFac");
                !actionTaken && probeHarv < probeConfig.harv && clickBtn("RaiseProbeHarv");
                !actionTaken && probeHarv > probeConfig.harv && clickBtn("LowerProbeHarv");
                !actionTaken && probeWire < probeConfig.wire && clickBtn("RaiseProbeWire");
                !actionTaken && probeWire > probeConfig.wire && clickBtn("LowerProbeWire");
                !actionTaken && probeCombat < probeConfig.combat && clickBtn("RaiseProbeCombat");
                !actionTaken && probeCombat > probeConfig.combat && clickBtn("LowerProbeCombat");
            }            
        }
    }
    function choosePrestige(){
        if(spaceFlag){
            if(prestigeS < 3 || prestigeS < prestigeU * 3){
                doProject(projects[85],false)
            }else{
                doProject(projects[84],false)
            }
        }
    }
    function doAutoSave(title = ""){
        save();
        loadGame = localStorage.getItem("saveGame"),
        loadProjectsUses = localStorage.getItem("saveProjectsUses"),
        loadProjectsFlags = localStorage.getItem("saveProjectsFlags");
        loadProjectsActive = localStorage.getItem("saveProjectsActive");
        loadStratsActive = localStorage.getItem("saveStratsActive");
        now = new Date();
        title = now.toLocaleString() + " " + title.toString();
        autoSave = {
            title:title,
            loadGame:loadGame,
            loadProjectsUses:loadProjectsUses,
            loadProjectsFlags:loadProjectsFlags,
            loadProjectsActive:loadProjectsActive,
            loadStratsActive:loadStratsActive,
        }
        autoSaves.unshift(autoSave)
        localStorage.setItem("autoSaves",JSON.stringify(autoSaves));
        updateAutoSaveList();
    }
    function updateAutoSaveList(){
        $("#autoSaves").empty();
        autoSaves.forEach(function(autoSave,id){
            $("#autoSaves").append($("<option/>",{
                value:id,
                text:autoSave.title
            }));
        })
    }
    function doLoadSave(){
        saveId = $("#autoSaves").val();
        saveGame = autoSaves[saveId].loadGame;
        projectsUses = autoSaves[saveId].loadProjectsUses;
        projectsFlags = autoSaves[saveId].loadProjectsFlags;
        projectsActive = autoSaves[saveId].loadProjectsActive;
        stratsActive = autoSaves[saveId].loadStratsActive;        
        localStorage.setItem("saveGame",saveGame);
        localStorage.setItem("saveProjectsUses",projectsUses);
        localStorage.setItem("saveProjectsFlags",projectsFlags);
        localStorage.setItem("saveProjectsActive",projectsActive);
        localStorage.setItem("saveStratsActive",stratsActive);
        location.reload();
    }
    function doDeleteSave(){
        saveId = $("#autoSaves").val();
        if(saveId >= 0){
            autoSaves.splice(saveId,1);
            localStorage.setItem("autoSaves",JSON.stringify(autoSaves));
            updateAutoSaveList();
            if($("#autoSaves option[value='" + saveId + "']")){
                $("#autoSaves").val(saveId);
            }            
        }        
    }
    function clickBtn(buttonName,debug = 1,fastClick = false){
        buttonID = "#btn" + buttonName
        if(!$(buttonID).prop("disabled")){
            $(buttonID).trigger("click");
            if(!fastClick){
                actionTaken = true;
            }
            if(debug <= debugLevel){
                console.log(buttonName);
            }
        }
        return actionTaken;
    }
    function doProject(project, autoSave = true){
        buttonID = "#" + project.id
        if($(buttonID).is(":visible") && !$(buttonID).prop("disabled")){
            $(buttonID).trigger("click");
            actionTaken = true;
            if(debugLevel >= 1){
                console.log("Project: " + project.title);
            }
            autoSave && doAutoSave(project.title);
        }
        return actionTaken;
    }
}
document.getElementsByTagName("head")[0].appendChild(tag);