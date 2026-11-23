(function () {
  "use strict";

  var CLICKID_TIMEOUT_MS = 5000;
  var STORAGE_KEY = "rt_clickid";

  /**
   * State requirement summaries for the guide.
   * Fees / times / training rules change — always confirm on the official link.
   * Expand or trim this list once target states are confirmed (blueprint §8).
   */
  var STATE_DATA = [
    {
      code: "AL",
      name: "Alabama",
      authority: "Alabama Law Enforcement Agency (ALEA) / local sheriff",
      training: "Firearms safety course typically required for a permit",
      inPerson: "Application through local sheriff; fingerprints often required",
      fee: "Confirm current state/county fees with issuing authority",
      processing: "Varies by county — confirm with issuing authority",
      officialUrl: "https://www.alea.gov/dps/criminal-justice-services/weapon-permits",
      officialLabel: "ALEA weapon permits information"
    },
    {
      code: "AK",
      name: "Alaska",
      authority: "Alaska Department of Public Safety",
      training: "Optional permit available; Alaska also has permitless carry for eligible adults",
      inPerson: "Fingerprint card and application for optional permit",
      fee: "Confirm current DPS fees",
      processing: "Confirm with Alaska DPS",
      officialUrl: "https://dps.alaska.gov/Statewide/R-I/PermitsLicensing/ConcealedCarry",
      officialLabel: "Alaska DPS concealed carry"
    },
    {
      code: "AZ",
      name: "Arizona",
      authority: "Arizona Department of Public Safety",
      training: "Firearms safety training required for a CCW permit",
      inPerson: "Application, fingerprints, and supporting documents to DPS",
      fee: "Confirm current DPS fees",
      processing: "Confirm with Arizona DPS",
      officialUrl: "https://www.azdps.gov/services/public-services-portal/concealed-weapons",
      officialLabel: "Arizona DPS concealed weapons"
    },
    {
      code: "AR",
      name: "Arkansas",
      authority: "Arkansas State Police",
      training: "Training course typically required for enhanced permit options",
      inPerson: "Application through State Police process; confirm current steps",
      fee: "Confirm current State Police fees",
      processing: "Confirm with Arkansas State Police",
      officialUrl: "https://www.dps.arkansas.gov/law-enforcement/arkansas-state-police/services-programs/firearms/",
      officialLabel: "Arkansas State Police firearms programs"
    },
    {
      code: "CA",
      name: "California",
      authority: "Local county sheriff or police chief (CCW licensing authority)",
      training: "Firearms training required; requirements set by licensing authority",
      inPerson: "In-person application, interview, fingerprints, and live-fire as required locally",
      fee: "State and local fees vary — confirm with your county",
      processing: "Varies widely by county",
      officialUrl: "https://oag.ca.gov/firearms/carry-license",
      officialLabel: "California DOJ carry license information"
    },
    {
      code: "CO",
      name: "Colorado",
      authority: "Local county sheriff",
      training: "Firearms training certificate typically required",
      inPerson: "Sheriff application, fingerprints, and supporting documents",
      fee: "Confirm county and state fees",
      processing: "Varies by county",
      officialUrl: "https://cdpsdocs.state.co.us/ors/docs/forms/ccw.pdf",
      officialLabel: "Colorado CCW information (CDPS)"
    },
    {
      code: "CT",
      name: "Connecticut",
      authority: "Connecticut Department of Emergency Services and Public Protection",
      training: "NRA or equivalent handgun safety course typically required",
      inPerson: "Local and state application steps, fingerprints, and eligibility review",
      fee: "Confirm current DESPP / local fees",
      processing: "Confirm with DESPP",
      officialUrl: "https://portal.ct.gov/DESPP/Division-of-State-Police/Special-Licensing-and-Firearms/Pistols-and-Revolvers",
      officialLabel: "Connecticut DESPP pistols and revolvers"
    },
    {
      code: "DE",
      name: "Delaware",
      authority: "Delaware Superior Court (prothonotary) / local process",
      training: "Firearms training may be required depending on permit type",
      inPerson: "Court filing, references, and related local requirements",
      fee: "Confirm current court / state fees",
      processing: "Confirm with local prothonotary",
      officialUrl: "https://courts.delaware.gov/superior/",
      officialLabel: "Delaware Superior Court"
    },
    {
      code: "FL",
      name: "Florida",
      authority: "Florida Department of Agriculture and Consumer Services (FDACS)",
      training: "Firearms competency certificate required for a license",
      inPerson: "Online or mail application; fingerprints required",
      fee: "Confirm current FDACS fees",
      processing: "Confirm published FDACS processing times",
      officialUrl: "https://www.fdacs.gov/Consumer-Resources/Concealed-Weapon-License",
      officialLabel: "Florida FDACS concealed weapon license"
    },
    {
      code: "GA",
      name: "Georgia",
      authority: "Georgia Probate Court (Weapons Carry License)",
      training: "Georgia has permitless carry for eligible adults; license optional for reciprocity",
      inPerson: "Apply at local probate court if seeking a Weapons Carry License",
      fee: "Confirm probate court fees",
      processing: "Varies by county",
      officialUrl: "https://georgia.gov/get-weapons-carry-license",
      officialLabel: "Georgia weapons carry license"
    },
    {
      code: "HI",
      name: "Hawaii",
      authority: "County police departments",
      training: "Requirements set by county police; licenses are discretionary",
      inPerson: "In-person application with county police; fingerprints and interview common",
      fee: "Confirm county fees",
      processing: "Varies by county",
      officialUrl: "https://ag.hawaii.gov/hcjdc/firearms-registration/",
      officialLabel: "Hawaii firearms registration information"
    },
    {
      code: "ID",
      name: "Idaho",
      authority: "Idaho State Police / county sheriff",
      training: "Training required for enhanced permit; Idaho also has permitless carry",
      inPerson: "Sheriff application and fingerprints for a permit",
      fee: "Confirm sheriff / state fees",
      processing: "Confirm with local sheriff",
      officialUrl: "https://isp.idaho.gov/BCI/concealed-weapons-permit/",
      officialLabel: "Idaho ISP concealed weapons permit"
    },
    {
      code: "IL",
      name: "Illinois",
      authority: "Illinois State Police (CCL)",
      training: "16-hour firearms training typically required for a CCL",
      inPerson: "Online application after training; fingerprints required",
      fee: "Confirm current ISP fees",
      processing: "Confirm published ISP processing times",
      officialUrl: "https://isp.illinois.gov/FirearmsSafety/CCL",
      officialLabel: "Illinois State Police CCL"
    },
    {
      code: "IN",
      name: "Indiana",
      authority: "Indiana State Police",
      training: "Indiana has permitless carry for eligible adults; license optional",
      inPerson: "Apply online through ISP if seeking a license",
      fee: "Confirm current ISP fees",
      processing: "Confirm with Indiana State Police",
      officialUrl: "https://www.in.gov/isp/firearms/",
      officialLabel: "Indiana State Police firearms"
    },
    {
      code: "IA",
      name: "Iowa",
      authority: "Iowa Department of Public Safety / county sheriff",
      training: "Iowa has permitless carry; permits available for reciprocity",
      inPerson: "Sheriff application for a permit to carry",
      fee: "Confirm sheriff / state fees",
      processing: "Confirm with local sheriff",
      officialUrl: "https://dps.iowa.gov/divisions/iowa-state-patrol/weapons-permits",
      officialLabel: "Iowa DPS weapons permits"
    },
    {
      code: "KS",
      name: "Kansas",
      authority: "Kansas Attorney General (concealed carry license)",
      training: "Kansas has permitless carry; license available with training",
      inPerson: "Application and fingerprints for optional license",
      fee: "Confirm current AG office fees",
      processing: "Confirm with Kansas Attorney General",
      officialUrl: "https://ag.ks.gov/trafficking/concealed-carry",
      officialLabel: "Kansas Attorney General concealed carry"
    },
    {
      code: "KY",
      name: "Kentucky",
      authority: "Kentucky State Police",
      training: "Kentucky has permitless carry; CCDW license optional",
      inPerson: "Apply through local sheriff for CCDW license",
      fee: "Confirm sheriff / state fees",
      processing: "Confirm with local sheriff",
      officialUrl: "https://kentuckystatepolice.org/conceal-carry-deadly-weapon/",
      officialLabel: "Kentucky State Police CCDW"
    },
    {
      code: "LA",
      name: "Louisiana",
      authority: "Louisiana State Police",
      training: "Firearms training required for a CHP",
      inPerson: "Online application; fingerprints required",
      fee: "Confirm current LSP fees",
      processing: "Confirm with Louisiana State Police",
      officialUrl: "https://www.lsp.org/about/managementservicessection/concealedhandgun/",
      officialLabel: "Louisiana State Police concealed handgun"
    },
    {
      code: "ME",
      name: "Maine",
      authority: "Maine Department of Public Safety",
      training: "Maine has permitless carry; permits available",
      inPerson: "Application to DPS for optional permit",
      fee: "Confirm current DPS fees",
      processing: "Confirm with Maine DPS",
      officialUrl: "https://www.maine.gov/dps/msp/licenses-permits/concealed-handgun-permits",
      officialLabel: "Maine concealed handgun permits"
    },
    {
      code: "MD",
      name: "Maryland",
      authority: "Maryland State Police Licensing Division",
      training: "Firearms training required for a wear-and-carry permit",
      inPerson: "Application, fingerprints, and training documentation",
      fee: "Confirm current MSP fees",
      processing: "Confirm published MSP processing times",
      officialUrl: "https://mdsp.maryland.gov/Organization/Pages/CriminalInvestigationBureau/LicensingDivision/Firearms/WearandCarryPermit.aspx",
      officialLabel: "Maryland wear and carry permit"
    },
    {
      code: "MA",
      name: "Massachusetts",
      authority: "Local police / Firearms Records Bureau",
      training: "Firearms safety course required for an LTC",
      inPerson: "Apply with local licensing authority; interview and references common",
      fee: "Confirm local and state fees",
      processing: "Varies by city/town",
      officialUrl: "https://www.mass.gov/guides/firearms-licensing-and-registration",
      officialLabel: "Massachusetts firearms licensing guide"
    },
    {
      code: "MI",
      name: "Michigan",
      authority: "Michigan County Clerk / Michigan State Police",
      training: "Pistol safety training required for a CPL",
      inPerson: "Apply at county clerk; fingerprints required",
      fee: "Confirm county / state fees",
      processing: "Confirm with county clerk",
      officialUrl: "https://www.michigan.gov/msp/services/ccw",
      officialLabel: "Michigan MSP concealed pistol license"
    },
    {
      code: "MN",
      name: "Minnesota",
      authority: "Local sheriff (Permit to Carry)",
      training: "Firearms training certificate required",
      inPerson: "Sheriff application, photo, and fingerprints",
      fee: "Confirm sheriff fees",
      processing: "Statutory timelines — confirm with sheriff",
      officialUrl: "https://dps.mn.gov/divisions/bca/bca-divisions/administrative/Pages/Permit-to-Carry-FAQ.aspx",
      officialLabel: "Minnesota DPS permit to carry FAQ"
    },
    {
      code: "MS",
      name: "Mississippi",
      authority: "Mississippi Department of Public Safety",
      training: "Mississippi has permitless carry; enhanced permits available",
      inPerson: "Apply through DPS for an enhanced permit",
      fee: "Confirm current DPS fees",
      processing: "Confirm with Mississippi DPS",
      officialUrl: "https://www.dps.ms.gov/firearms",
      officialLabel: "Mississippi DPS firearms"
    },
    {
      code: "MO",
      name: "Missouri",
      authority: "Missouri county sheriff (CCW permit)",
      training: "Missouri has permitless carry; permits available for reciprocity",
      inPerson: "Sheriff application for optional CCW permit",
      fee: "Confirm sheriff fees",
      processing: "Confirm with local sheriff",
      officialUrl: "https://ago.mo.gov/criminal-division/public-safety/concealed-carry/",
      officialLabel: "Missouri AG concealed carry"
    },
    {
      code: "MT",
      name: "Montana",
      authority: "Montana county sheriff",
      training: "Montana has permitless carry; permits available",
      inPerson: "Sheriff application for optional permit",
      fee: "Confirm sheriff fees",
      processing: "Confirm with local sheriff",
      officialUrl: "https://dojmt.gov/enforcement/criminal-investigation/concealed-weapons-permits/",
      officialLabel: "Montana DOJ concealed weapons permits"
    },
    {
      code: "NE",
      name: "Nebraska",
      authority: "Nebraska State Patrol",
      training: "Handgun training required for a permit",
      inPerson: "Application and fingerprints through State Patrol process",
      fee: "Confirm current NSP fees",
      processing: "Confirm with Nebraska State Patrol",
      officialUrl: "https://statepatrol.nebraska.gov/services/concealed-handgun-permits",
      officialLabel: "Nebraska State Patrol concealed handgun permits"
    },
    {
      code: "NV",
      name: "Nevada",
      authority: "Nevada county sheriff",
      training: "Approved firearms course required",
      inPerson: "Sheriff application, fingerprints, and course certificate",
      fee: "Confirm sheriff fees",
      processing: "Varies by county",
      officialUrl: "https://www.nvrepository.state.nv.us/ccw_instructions.shtml",
      officialLabel: "Nevada CCW instructions"
    },
    {
      code: "NH",
      name: "New Hampshire",
      authority: "New Hampshire local police / Department of Safety",
      training: "New Hampshire has permitless carry; permits available",
      inPerson: "Apply locally for optional pistol/revolver license",
      fee: "Confirm local / state fees",
      processing: "Confirm with local licensing authority",
      officialUrl: "https://www.nhsp.nh.gov/permits-and-licensing/pistol-and-revolver-license",
      officialLabel: "New Hampshire pistol and revolver license"
    },
    {
      code: "NJ",
      name: "New Jersey",
      authority: "New Jersey State Police / local police",
      training: "Firearms training required for a carry permit",
      inPerson: "Local application, fingerprints, references, and court/police steps",
      fee: "Confirm local and state fees",
      processing: "Varies — confirm with local police",
      officialUrl: "https://www.njsp.org/firearms/",
      officialLabel: "New Jersey State Police firearms"
    },
    {
      code: "NM",
      name: "New Mexico",
      authority: "New Mexico Department of Public Safety",
      training: "Approved firearms training required for a CHL",
      inPerson: "Application and fingerprints to DPS",
      fee: "Confirm current DPS fees",
      processing: "Confirm with New Mexico DPS",
      officialUrl: "https://www.dps.nm.gov/index.php/concealed-carry/",
      officialLabel: "New Mexico DPS concealed carry"
    },
    {
      code: "NY",
      name: "New York",
      authority: "Local county licensing officer / NYPD (NYC)",
      training: "Firearms training required under state law",
      inPerson: "In-person application, interview, fingerprints, and local requirements",
      fee: "Confirm local licensing fees",
      processing: "Varies widely by county / NYC",
      officialUrl: "https://troopers.ny.gov/firearms",
      officialLabel: "New York State Police firearms"
    },
    {
      code: "NC",
      name: "North Carolina",
      authority: "North Carolina county sheriff",
      training: "Approved firearms safety & training course required",
      inPerson: "Sheriff application, fingerprints, and course certificate",
      fee: "Confirm sheriff fees",
      processing: "Confirm with local sheriff",
      officialUrl: "https://www.ncsbi.gov/Services/Concealed-Carry",
      officialLabel: "North Carolina SBI concealed carry"
    },
    {
      code: "ND",
      name: "North Dakota",
      authority: "North Dakota Bureau of Criminal Investigation",
      training: "North Dakota has permitless carry; class 1/2 licenses available",
      inPerson: "Application through BCI for optional license",
      fee: "Confirm current BCI fees",
      processing: "Confirm with North Dakota BCI",
      officialUrl: "https://attorneygeneral.nd.gov/public-safety/concealed-weapons-licenses",
      officialLabel: "North Dakota concealed weapons licenses"
    },
    {
      code: "OH",
      name: "Ohio",
      authority: "Ohio county sheriff",
      training: "Ohio has permitless carry; licenses available for reciprocity",
      inPerson: "Sheriff application for optional license",
      fee: "Confirm sheriff fees",
      processing: "Confirm with local sheriff",
      officialUrl: "https://www.ohioattorneygeneral.gov/Law-Enforcement/Concealed-Carry",
      officialLabel: "Ohio Attorney General concealed carry"
    },
    {
      code: "OK",
      name: "Oklahoma",
      authority: "Oklahoma State Bureau of Investigation",
      training: "Oklahoma has permitless carry; SDA licenses available",
      inPerson: "Application to OSBI for optional license",
      fee: "Confirm current OSBI fees",
      processing: "Confirm with OSBI",
      officialUrl: "https://osbi.ok.gov/services/self-defense-act",
      officialLabel: "Oklahoma OSBI Self-Defense Act"
    },
    {
      code: "OR",
      name: "Oregon",
      authority: "Oregon county sheriff",
      training: "Firearms training required for a CHL",
      inPerson: "Sheriff application, fingerprints, and course certificate",
      fee: "Confirm sheriff fees",
      processing: "Confirm with local sheriff",
      officialUrl: "https://www.oregon.gov/osp/pages/firearms.aspx",
      officialLabel: "Oregon State Police firearms information"
    },
    {
      code: "PA",
      name: "Pennsylvania",
      authority: "Pennsylvania county sheriff / local licensing authority",
      training: "No statewide training mandate for LTCF; local practices vary",
      inPerson: "In-person application and photo at county licensing authority",
      fee: "Confirm county fees",
      processing: "Confirm with county licensing authority",
      officialUrl: "https://www.psp.pa.gov/firearms-information/Pages/Firearms-Information.aspx",
      officialLabel: "Pennsylvania State Police firearms information"
    },
    {
      code: "RI",
      name: "Rhode Island",
      authority: "Local city/town police or Rhode Island Attorney General",
      training: "Safety course often required depending on permit path",
      inPerson: "Local or AG application; interview and references common",
      fee: "Confirm local / AG fees",
      processing: "Confirm with licensing authority",
      officialUrl: "https://www.riag.ri.gov/CivilDivision/ConsumerProtectionUnit/Firearms.php",
      officialLabel: "Rhode Island AG firearms information"
    },
    {
      code: "SC",
      name: "South Carolina",
      authority: "South Carolina Law Enforcement Division (SLED)",
      training: "South Carolina has permitless carry; CWP available with training",
      inPerson: "Application to SLED for optional CWP",
      fee: "Confirm current SLED fees",
      processing: "Confirm with SLED",
      officialUrl: "https://www.sled.sc.gov/cwp",
      officialLabel: "South Carolina SLED CWP"
    },
    {
      code: "SD",
      name: "South Dakota",
      authority: "South Dakota Secretary of State",
      training: "South Dakota has permitless carry; permits available",
      inPerson: "Application for optional permit through Secretary of State process",
      fee: "Confirm current fees",
      processing: "Confirm with South Dakota Secretary of State",
      officialUrl: "https://sdsos.gov/general-information/concealed-pistol-permits/default.aspx",
      officialLabel: "South Dakota concealed pistol permits"
    },
    {
      code: "TN",
      name: "Tennessee",
      authority: "Tennessee Department of Safety & Homeland Security",
      training: "Tennessee has permitless carry; enhanced/concealed permits available",
      inPerson: "Online application for optional handgun carry permit",
      fee: "Confirm current TDSHS fees",
      processing: "Confirm published Department of Safety times",
      officialUrl: "https://www.tn.gov/safety/handgun-carry-permits.html",
      officialLabel: "Tennessee handgun carry permits"
    },
    {
      code: "TX",
      name: "Texas",
      authority: "Texas Department of Public Safety (DPS)",
      training: "Texas has permitless carry; LTC available with classroom and range training",
      inPerson: "Online LTC application after training; fingerprints required",
      fee: "Confirm current Texas DPS LTC fees",
      processing: "Confirm published Texas DPS processing times",
      officialUrl: "https://www.dps.texas.gov/section/handgun-licensing",
      officialLabel: "Texas DPS handgun licensing"
    },
    {
      code: "UT",
      name: "Utah",
      authority: "Utah Bureau of Criminal Identification",
      training: "Utah has permitless carry; permits popular for reciprocity",
      inPerson: "Application and fingerprints for optional permit",
      fee: "Confirm current BCI fees",
      processing: "Confirm with Utah BCI",
      officialUrl: "https://bci.utah.gov/concealed-firearm/",
      officialLabel: "Utah BCI concealed firearm"
    },
    {
      code: "VT",
      name: "Vermont",
      authority: "No state-issued concealed carry permit (permitless carry)",
      training: "Vermont does not issue a general concealed carry permit",
      inPerson: "No state permit application; follow Vermont firearms laws",
      fee: "N/A — no state CCW permit",
      processing: "N/A",
      officialUrl: "https://www.vtspc.org/",
      officialLabel: "Vermont State Police information"
    },
    {
      code: "VA",
      name: "Virginia",
      authority: "Virginia circuit court clerk (local)",
      training: "Optional competency proof can support an application",
      inPerson: "Apply at local circuit court clerk; photo and fingerprints as required",
      fee: "Confirm clerk / state fees",
      processing: "Confirm with local circuit court clerk",
      officialUrl: "https://www.vsp.virginia.gov/firearms/",
      officialLabel: "Virginia State Police firearms"
    },
    {
      code: "WA",
      name: "Washington",
      authority: "Washington local law enforcement / county",
      training: "Firearms training required for a CPL",
      inPerson: "Local application, fingerprints, and course certificate",
      fee: "Confirm local fees",
      processing: "Confirm with local licensing authority",
      officialUrl: "https://www.wsp.wa.gov/crime/firearms/",
      officialLabel: "Washington State Patrol firearms"
    },
    {
      code: "WV",
      name: "West Virginia",
      authority: "West Virginia State Police / county sheriff",
      training: "West Virginia has permitless carry; licenses available",
      inPerson: "Sheriff application for optional license",
      fee: "Confirm sheriff / state fees",
      processing: "Confirm with local sheriff",
      officialUrl: "https://www.wvsp.gov/legal/Pages/weaponpermits.aspx",
      officialLabel: "West Virginia weapon permits"
    },
    {
      code: "WI",
      name: "Wisconsin",
      authority: "Wisconsin Department of Justice",
      training: "Firearms training required for a concealed carry license",
      inPerson: "Online application after training; photo and supporting docs",
      fee: "Confirm current DOJ fees",
      processing: "Confirm published Wisconsin DOJ times",
      officialUrl: "https://www.doj.state.wi.us/dles/cib/conceal-carry/concealed-carry",
      officialLabel: "Wisconsin DOJ concealed carry"
    },
    {
      code: "WY",
      name: "Wyoming",
      authority: "Wyoming county sheriff",
      training: "Wyoming has permitless carry; permits available",
      inPerson: "Sheriff application for optional permit",
      fee: "Confirm sheriff fees",
      processing: "Confirm with local sheriff",
      officialUrl: "https://wyomingdci.wyo.gov/criminal-justice-information/concealed-firearm-permits",
      officialLabel: "Wyoming DCI concealed firearm permits"
    }
  ];

  function byCode(code) {
    for (var i = 0; i < STATE_DATA.length; i++) {
      if (STATE_DATA[i].code === code) return STATE_DATA[i];
    }
    return null;
  }

  function populateStateSelect() {
    var select = document.getElementById("state-select");
    if (!select) return;

    STATE_DATA.forEach(function (state) {
      var opt = document.createElement("option");
      opt.value = state.code;
      opt.textContent = state.name;
      select.appendChild(opt);
    });

    select.addEventListener("change", function () {
      renderStatePanel(select.value);
    });
  }

  function renderStatePanel(code) {
    var panel = document.getElementById("state-panel");
    if (!panel) return;

    var state = byCode(code);
    if (!state) {
      panel.hidden = true;
      panel.innerHTML = "";
      return;
    }

    panel.hidden = false;
    panel.innerHTML =
      "<h3>" +
      escapeHtml(state.name) +
      " — concealed carry overview</h3>" +
      "<ul class=\"state-meta\">" +
      metaItem("Issuing authority", state.authority) +
      metaItem("Training requirement", state.training) +
      metaItem("In-person steps", state.inPerson) +
      metaItem("State fee", state.fee) +
      metaItem("Typical processing time", state.processing) +
      "<li><strong>Official application page</strong>" +
      "<a href=\"" +
      escapeAttr(state.officialUrl) +
      "\" target=\"_blank\" rel=\"noopener noreferrer\">" +
      escapeHtml(state.officialLabel) +
      "</a></li>" +
      "</ul>";
  }

  function metaItem(label, value) {
    return (
      "<li><strong>" +
      escapeHtml(label) +
      "</strong>" +
      escapeHtml(value) +
      "</li>"
    );
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/'/g, "&#39;");
  }

  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("site-nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
  }

  function trackingHost() {
    var host = (window.location.hostname || "").replace(/^www\./i, "");
    return host || "localhost";
  }

  function trackedUrl(clickid) {
    var base = "https://trk." + trackingHost() + "/click";
    if (clickid) {
      return base + "?clickid=" + encodeURIComponent(clickid);
    }
    return base;
  }

  function urlClickid() {
    try {
      return new URLSearchParams(window.location.search).get("clickid") || "";
    } catch (e) {
      return "";
    }
  }

  function storedClickid() {
    try {
      return window.localStorage.getItem(STORAGE_KEY) || "";
    } catch (e) {
      return "";
    }
  }

  function saveClickid(clickid) {
    if (!clickid) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, clickid);
    } catch (e) {
      /* ignore */
    }
  }

  function fetchClickid(useFallback) {
    var controller =
      typeof AbortController !== "undefined" ? new AbortController() : null;
    var timer = null;
    var body = new URLSearchParams({
      referrer: window.location.href
    });

    if (useFallback) {
      body.set("use_fallback", "1");
    }

    var options = {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      },
      body: body
    };

    if (controller) {
      options.signal = controller.signal;
      timer = window.setTimeout(function () {
        controller.abort();
      }, CLICKID_TIMEOUT_MS);
    }

    return fetch("./clickid.php", options)
      .then(function (response) {
        if (!response.ok) {
          throw new Error("clickid http " + response.status);
        }
        return response.json();
      })
      .then(function (data) {
        if (!data || !data.ok || !data.clickid) {
          throw new Error((data && data.error) || "no clickid");
        }
        return String(data.clickid);
      })
      .finally(function () {
        if (timer) {
          window.clearTimeout(timer);
        }
      });
  }

  function resolveClickid() {
    return fetchClickid(false)
      .catch(function () {
        return fetchClickid(true);
      })
      .catch(function () {
        var fromUrl = urlClickid();
        if (fromUrl) return fromUrl;

        var fromStore = storedClickid();
        if (fromStore) return fromStore;

        return fetchClickid(true);
      });
  }

  function rushCta() {
    return document.getElementById("rush-permit-cta");
  }

  function enableCta(href) {
    var cta = rushCta();
    if (!cta) return;
    cta.href = href;
    cta.classList.remove("is-loading");
    cta.removeAttribute("aria-busy");
  }

  function initClickidTracking() {
    // Always keep a real destination — never leave the button on "#"
    enableCta(trackedUrl(""));

    resolveClickid()
      .then(function (clickid) {
        saveClickid(clickid);
        enableCta(trackedUrl(clickid));
      })
      .catch(function () {
        enableCta(trackedUrl(""));
      });
  }

  function init() {
    populateStateSelect();
    initNav();
    initClickidTracking();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
