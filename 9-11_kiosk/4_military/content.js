var timelineContentList = [
  {
    title_en: "Authorization for Use of Military Force of 2001",
    title_es: "Spanish title",
    time_en: "Sept 18, 2001",
    time_es: "",
    body_en: "The AUMF authorized the President to use the U.S. armed forces against those responsible for the 9/11 attacks.",
    body_es: "Spanish body",
    rank: 2
  },
  {
    title_en: "Operation Enduring Freedom begins",
    title_es: "Spanish title",
    time_en: "Oct 7, 2001",
    time_es: "",
    body_en: "President Bush announced that airstrikes had officially begun in Afghanistan, formally beginning Operation Enduring Freedom.",
    body_es: "Spanish body",
    caption_en: "U.S. soldiers from the 10th Mountain Division deployed during Operation Enduring Freedom.",
    caption_es: "Spanish caption",
    image: "Operation_Enduring_Freedom_Public_Domain.jpg",
    credit: "",
    rank: 1
  },
  {
    title_en: "UN Security Council Resolution 1378",
    title_es: "Spanish title",
    time_en: "Nov 14, 2001",
    time_es: "",
    body_en: "Resolution 1378 affirmed that the United Nations would play an important role in Afghanistan’s development.",
    body_es: "Spanish body",
    rank: 4,
  },
  {
    title_en: "The Bonn Agreement",
    title_es: "Spanish title",
    time_en: "Dec 5, 2001",
    time_es: "",
    body_en: "Signed by several anti-Taliban factions and political groups, it outlined a roadmap and timetable for establishing peace and security while reconstructing Afghanistan.",
    body_es: "Spanish body",
    rank: 4
  },
  {
    title_en: "Battle of Tora Bora",
    title_es: "Spanish title",
    time_en: "Dec 6–17, 2001",
    time_es: "",
    body_en: "The battle has been credited with the fall of the Taliban government, though Osama bin Laden and other al-Qaeda leaders escaped without capture.",
    body_es: "Spanish body",
    caption_en: "US airstrike during the battle of Tora Bora.",
    caption_es: "Spanish caption",
    image: "Strikes_on_Tora_Bora_Public_Domain.png",
    credit: "",
    rank: 2
  },
  {
    title_en: `The "Torture Memos"`,
    title_es: "Spanish title",
    time_en: "Jan 9, 2002",
    time_es: "",
    body_en: `The memo advised the President, CIA, and Department of Defense on “enhanced interrogation techniques” used on prisoners suspected of terrorism.`,
    body_es: "Spanish body",
    caption_en: `Excerpt of the "Torture Memo" also referred to as as the "Yoo Memo"`,
    caption_es: "Spanish caption",
    image: "Yoo_memo_Public_Domain.png",
    credit: "",
    rank: 2
  },
  {
    title_en: `Bush describes the "Axis of Evil"`,
    title_es: "Spanish title",
    time_en: "Jan 29, 2002",
    time_es: "",
    body_en: "",
    body_es: "Spanish body",
    caption_en: `President George W. Bush at the 2002 State of the Union address.`,
    caption_es: "Spanish caption",
    image: "President_Bush_at_State_of_the_Union_Public_Domain.jpg",
    credit: "",
    rank: 1
  },
  {
    title_en: "Operation Anaconda",
    title_es: "Spanish title",
    time_en: "Mar 1–18, 2002",
    time_es: "",
    body_en: `Operation Anaconda resulted in hundreds of Taliban casualties. Members of the Taliban would later refer to this as the "beginning of the sacred jihad against the occupation of Afghanistan."`,
    body_es: "Spanish body",
    caption_en: `Soldiers from the 10th Mountain Division participating in Operation Anaconda.`,
    caption_es: "Spanish caption",
    image: "Operation_Anaconda_Public_Domain.jpg",
    credit: "",
    rank: 3
  },
  {
    title_en: "President Bush arrives at Emma E. Booker Elementary School",
    title_es: "Spanish title",
    time_en: "8:55 AM",
    time_es: "8:55 AM",
    body_en: "The President is reading a story to students when he first learns of the attacks.",
    body_es: "Spanish body",
    caption_en: "President Bush reading <i>The Pet Goat</i> to a class of elementary school students at Emma E. Booker Elementary School.",
    caption_es: "Spanish caption",
    image: "Bush_reading_Public_Domain.jpg",
    credit: "",
    rank: 4
  },
  {
    title_en: "Hamid Karzai appointed as interim President of Afghanistan",
    title_es: "Spanish title",
    time_en: "June 13, 2002",
    time_es: "",
    body_en: "Hamid Karzai, a prominent anti-Taliban politician, was chosen as interim president after receiving the most votes of the 1500-member council.",
    body_es: "Spanish body",
    caption_en: "Hamid Karzai appointed as interim President of Afghanistan during Loya Jirga.",
    caption_es: "Spanish caption",
    image: "Hamid_Karzai_Piublic_Domain.jpg",
    credit: "",
    rank: 2
  },
  {
    title_en: "UA93 warned of earlier hijackings",
    title_es: "Spanish title",
    time_en: "9:24 AM",
    time_es: "9:24 AM",
    body_en: "The pilots do not understand the warning and ask for clarification.",
    body_es: "Spanish body",
    rank: 4,
    link: "Fighting_chance_para_1"
  },
  {
    title_en: "UA93 is hijacked",
    title_es: "Spanish title",
    time_en: "9:28 AM",
    time_es: "9:28 AM",
    body_en: "Four hijackers seize control of the plane.",
    body_es: "Spanish body",
    rank: 2
  },
  {
    title_en: "UA93 passengers learn of WTC attacks",
    title_es: "Spanish title",
    time_en: "9:30 AM",
    time_es: "9:30 AM",
    body_en: "In phone calls with family on the ground, passengers on Flight 93 learn that two hijacked planes have already been crashed. They realize that their situation is likely connected, and begin planning to retake the plane.",
    body_es: "Spanish body",
    rank: 4
  },
  {
    title_en: "AA77 strikes the Pentagon",
    title_es: "Spanish title",
    time_en: "9:37 AM",
    time_es: "9:37 AM",
    body_en: "The plane strikes a the building at 530 mph (850 kph). It impacts a recently-renovated portion of the building, which is still mostly unoccupied. Even so, 125 people in the Pentagon are killed.",
    body_es: "Spanish body",
    caption_en: "The aftermath of AA77's impact on the Pentagon.",
    caption_es: "Spanish caption",
    image: "Pentagon_aftermath_Public_Domain.JPEG",
    rank: 1
  },
  {
    title_en: "President Bush boards Air Force One",
    title_es: "Spanish title",
    time_en: "9:55 AM",
    time_es: "9:55 AM",
    body_en: "Air Force One lifts off in Florida to ensure the President's safety. They do not have a plan about where to go.",
    body_es: "Spanish body",
    caption_en: "President Bush aboard Air Force One on September 11.",
    caption_es: "Spanish caption",
    image: "President_George_W._Bush_aboard_Air_Force_One_Public_Domain.jpg",
    rank: 4
  },
  {
    title_en: "UA93 passengers revolt",
    title_es: "Spanish title",
    time_en: "9:57 AM",
    time_es: "9:57 AM",
    body_en: "After voting on whether to act, passengers rush from the rear of the plane towards the front. The hijackers begin tipping the plane forwards and backwards in defense, as passengers begin trying to break into the cockpit. It remains unclear if they succeeded.",
    body_es: "Spanish body",
    rank: 2,
    link: "Struggle_para_1"
  },
  {
    title_en: "South Tower falls",
    title_es: "Spanish title",
    time_en: "9:59 AM",
    time_es: "9:59 AM",
    body_en: "",
    body_es: "Spanish body",
    rank: 2,
    link: "Collapse_para_1"
  },
  {
    title_en: "UA93 crashes",
    title_es: "Spanish title",
    time_en: "10:03 AM",
    time_es: "10:03 AM",
    body_en: "As passengers rush the cockpit and struggle to regain control of the plane, the hijackers deliberately crash it in a field in southwestern Pennslyvania. Flight 93 was about 20 minutes from reaching Washington, D.C.",
    body_es: "Spanish body",
    rank: 2
  },
  {
    title_en: "North Tower falls",
    title_es: "Spanish title",
    time_en: "10:28 AM",
    time_es: "10:28 AM",
    body_en: "After burning for 1 hour and 42 minutes, the North Tower collapses. Because the impact severed all three stairwells, no one above the impact site escapes. A worldwide audience views the collapse live on television.",
    body_es: "Spanish body",
    caption_en: "<i>From bottom to top:</i> The ruins of the North Tower, 6 WTC, and 7 WTC.",
    caption_es: "Spanish caption",
    image: "WTC_1_6_7_ruins_Public_Domain.jpg",
    rank: 2
  },
  {
    title_en: "7 WTC falls",
    title_es: "Spanish title",
    time_en: "5:21 PM",
    time_es: "5:21 PM",
    body_en: "",
    body_es: "Spanish body",
    caption_en: "7 WTC on fire before its collapse.",
    caption_es: "Spanish caption",
    image: "Wtc7onfire_Public_Domain.jpg",
    rank: 3
  },
];

var bodyContentList = [
  {
    id: "Swift_response",
    header_en: "A Swift Response",
    header_es: "Spanish header",
    body_en: "In the immediate aftermath of September 11, Congress passed the Authorization for Use of Military Force of 2001 (420-1 in the House and 98-0 in the Senate), formally launching the War on Terror and Operation Enduring Freedom. President Bush signed the resolution into law on September 18, 2001. He quickly dispatched U.S. troops to Afghanistan after Taliban leaders refused to turn over Osama bin Laden and other terrorist leaders. On October 7, 2001, American and British warplanes began targeting Taliban forces and al-Qaeda. A combination of anti-Taliban leaders and U.S. military special forces temporarily toppled the Taliban regime in December of 2001 at the Battle of Tora Bora and installed a pro-American government in June of 2002 led by Hamid Karzai. Although the Taliban regime was temporarily defeated, Osama bin Laden escaped to northern Pakistan.",
    body_es: "Spanish body"
  },
  {
    id: "Axis_of_evil_1",
    header_en: `An "Axis of Evil"`,
    header_es: "Spanish header",
    body_en: "President Bush and his advisors did not believe the collapse of the Taliban government had ended the War on Terror. Rather, the military conflict in Afghanistan transformed into a larger plan to reshape the Middle East along pro-American lines. This signaled the advent of the Bush Doctrine. The Bush Doctrine is a strategy that proposes undertaking a preemptive war against governments believed to be a threat to U.S. national security, even if the danger was not directly imminent.",
    body_es: "Spanish body"
  },
  {
    id: "Axis_of_evil_2",
    body_en: "In line with this doctrine, President Bush declared that Iraq belonged to an “axis of evil” alongside the likes of North Korea and Iran. Over the next several years, Bush convinced Congress and the American public that Iraq presented an immediate threat to the security of the United States. He did so by falsely connecting Saddam Hussein, the president of Iraq, to the 9/11 attacks, and accused Iraqi leadership of stockpiling “Weapons of Mass Destruction.” These allegations were first presented by Secretary of State Colin Powell on February 6, 2003, despite U.N. evidence to the contrary.",
    body_es: "Spanish body"
  },
  {
    id: "Iraq_war_1",
    header_en: `The Iraq War`,
    header_es: "Spanish header",
    body_en: "Anti-war critics responded swiftly by organizing mass demonstrations in major cities throughout the United States. Yet, the majority of the American public agreed, at the very least, that Saddam Hussein was evil and therefore should be removed, regardless of whether he was involved in the 9/11 attacks. In March 2003, after receiving congressional approval through the Authorization for Use of Military Force Against Iraq Resolution (296-133 in the House and 77-23 in the Senate), the U.S. Military unleashed a massive bombing campaign over Baghdad, the Iraqi capital. This strategy was referred to as “Shock and Awe,” and it formally began the Iraq War, or “Operation Iraqi Freedom.” Within several weeks, Baghdad fell and Saddam Hussein went into hiding, prompting President Bush to declare that major combat operations had ended in Iraq.",
    body_es: "Spanish body"
  },
  {
    id: "Iraq_war_2",
    body_en: "Saddam Hussein was captured several months later and executed by the Iraqi government in 2006, but the war raged on. Weapons of mass destruction were never found, and combat operations continued. More American soldiers died after Bush proclaimed victory than had died during the invasion itself.",
    body_es: "Spanish body"
  },
  {
    id: "Deteriorating_situation_1",
    header_en: `A Deteriorating Situation`,
    header_es: "Spanish header",
    body_en: "U.S. occupation and efforts at nation building also caused major problems in Iraq. The U.S. presence had a destabilizing effect, ultimately leading to a civil war between the nation’s Shi’ite Muslim majority and the Sunni minority. This civil war also pulled in the Kurdish people, a minority Muslim group to the north, as well as Al-Qaeda, who had been previously absent from the country. During July 2006 alone, nearly 3,500 Iraqis were killed. More than half of the deaths occurred in the Baghdad area. In response, the U.S. increased troop deployments on an emergency basis.",
    body_es: "Spanish body"
  },
  {
    id: "Deteriorating_situation_2",
    body_en: "Without a military draft, the United States struggled to provide a sufficient number of active-duty troops in Iraq. In 2004, the military began relying on National Guard units to meet troop requirements. To make up for staffing shortages, the U.S. outsourced jobs to private companies. These companies profited by supplying troops with housing, meals, and transportation, completing construction jobs, and providing military and diplomatic personnel. The Defense Department would later be criticized for accepting these contracts without competitive bidding and awarding them to companies such as Halliburton, which had close ties to Vice President Dick Cheney.",
    body_es: "Spanish body"
  },
  {
    id: "Deteriorating_situation_3",
    body_en: "Amid the prolonged war in Iraq, Bush won reelection in 2004 by vowing to finish the war, asserting that to do anything less would encourage terrorists, subvert democracy in the Middle East, and dishonor troops who had already been killed. Although the war effort still had some staunch supporters, the American public’s patience had begun to wane during Bush’s second term. In 2008, polls showed that 54% of Americans considered the invasion of Iraq a mistake and 49% wanted American troops returned home.",
    body_es: "Spanish body"
  },
  {
    id: "Deteriorating_situation_3",
    body_en: "Meanwhile, the situation in Afghanistan continued to deteriorate. In 2006, the Taliban reemerged, as the Afghan government proved both frequently corrupt and incapable of providing social services or security for its citizens.",
    body_es: "Spanish body"
  },
  {
    id: "Torture_1",
    header_en: `Terrorism and Torture`,
    header_es: "Spanish header",
    body_en: "The American handling of prisoners of war and suspected terrorists divided the American public. In 2004, American soldiers were photographed torturing prisoners in Abu Ghraib, a prison located twenty miles west of Baghdad. These instances of torture (or “enhanced interrogation techniques,” as they were sometimes called) were authorized by the U.S. Department of Justice. This was done under the assertion that the Geneva Conventions, which explicitly forbid torture or cruelty in any form, did not apply to American interrogators overseas. These torture techniques included sleep deprivation, subjection to deafening noise, and deprivation of food and drink, among other disturbing methods.",
    body_es: "Spanish body"
  },
  {
    id: "Torture_2",
    body_en: "Waterboarding, in particular, proved to be a point of contention. Waterboarding is a form of torture in which water is poured over a cloth covering the face, causing the person to experience the sensation of drowning.",
    body_es: "Spanish body"
  },
  {
    id: "Torture_3",
    body_en: `Not only was the process of waterboarding inhumane, but it also produced unreliable information. Prisoners falsely confessed to crimes they did not commit to give the interrogators whatever they wanted to hear. Khalid Shaykh Muhammad fabricated stories to make the torture stop. The same was true for the "confessions" elicited by the technique on Riduan Isamuddin.`,
    body_es: "Spanish body"
  },
  {
    id: "Torture_4",
    body_en: "The publicization of these instances of torture drove a wedge in public support, as Americans were asked to consider the ethics of using torture on suspected terrorists. In a Pew poll published in July 2004, 43% of Americans said that torture of suspected terrorists to gain important information is often or sometimes justified.",
    body_es: "Spanish body"
  },
  {
    id: "Gitmo_1",
    header_en: `Human Rights Violations at Guantanamo Bay`,
    header_es: "Spanish header",
    body_en: "The question of human rights violations arose again surrounding the Guantanamo Bay Detention Camp, a prison located within the Guantanamo Bay Naval Base in Cuba. The prison was established by George W. Bush in 2002. The facility housed more than 600 men classified as enemy combatants, who were subjected to extreme interrogation and deprived of legal counsel. Amnesty International declared that conditions at Guantanamo Bay constituted a major breach of human rights, and the Center for Constitutional Rights declared that practices violated the Due Process Clause of the Fifth and Fourteenth amendments of the U.S. Constitution.",
    body_es: "Spanish body"
  },
  {
    id: "Gitmo_2",
    body_en: "In the 2006 Supreme Court case, <i>Hamdan v. Rumsfeld</i>, the Court ruled that military tribunals established by the president to prosecute Guantanamo prisoners were unconstitutional, and Congress passed legislation providing a small measure of protection for the four hundred prisoners who remained in Guantanamo.",
    body_es: "Spanish body"
  },
  {
    id: "Unfinished_1",
    header_en: `An Unfinished Agenda`,
    header_es: "Spanish header",
    body_en: "In 2008, Barack Obama, a senator from Illinois, defeated John McCain from Arizona for the presidency. Obama, who famously critiqued the wars in the Middle East in 2002, appealed to voters who were tired of the so-called “Forever War.”",
    body_es: "Spanish body"
  },
  {
    id: "Unfinished_2",
    body_en: "Following the election of President Obama, the U.S. Military increased combat troop withdrawals from Iraq and slowly turned over control to the newly elected Iraqi government. U.S. combat forces withdrew from Iraq on December 18, 2011, per the U.S.–Iraq Status of Forces Agreement, though violence and instability continued to rock the country.",
    body_es: "Spanish body"
  },
  {
    id: "Unfinished_3",
    body_en: "Meanwhile, in 2009, the Obama administration deployed 17,000 additional troops to Afghanistan. As part of a counterinsurgency campaign, U.S. Special Forces and CIA drones targeted al-Qaeda and Taliban leaders. Obama would later receive criticism for his use of drone warfare. In the name of counterterrorism, many drone strikes occurred in Pakistan, Yemen, and Somalia, countries not at war with the United States. Drone strikes also frequently resulted in civilian casualties, including those attending a wedding in Aqabat Za’j, Yemen. The Obama administration would also receive extensive criticism for an accidental attack on Kunduz Hospital in Afghanistan.",
    body_es: "Spanish body"
  },
  {
    id: "Unfinished_4",
    body_en: "In May 2011, U.S. Navy SEALs conducted a raid deep into Pakistan that led to the killing of Osama bin Laden. Following the killing of bin Laden, the United States and NATO began a phased withdrawal from Afghanistan, with the aim of removing all combat troops by 2014. Although weak militarily, the Taliban remained politically influential in Afghanistan.",
    body_es: "Spanish body"
  },
  {
    id: "Unfinished_5",
    body_en: "On December 28, 2014, President Obama announced the end of Operation Enduring Freedom in Afghanistan. In its place, his administration announces the advent of Operation Freedom's Sentinel. Operation Freedom’s Sentinel began January 1, 2015. It signaled a shift away from major combat operations and towards NATO-led training and counterterrorism.",
    body_es: "Spanish body"
  },
  {
    id: "Taliban_1",
    header_en: `The Taliban Resurgence`,
    header_es: "Spanish header",
    body_en: "On November 8, 2016, Donald Trump defeated Secretary of State Hillary Clinton for the presidency. During his campaign, Trump vowed to bring American troops home from Afghanistan during his presidency. In August 2017, Trump announced that American withdrawal would be open-ended and that conditions on the ground would dictate withdrawal rather than a set timeline.",
    body_es: "Spanish body"
  },
  {
    id: "Taliban_2",
    body_en: "In the summer of 2018, President Trump announced his intention to enter into negotiations with the Taliban to begin the process of withdrawals. On February 29, 2020, the Trump administration entered a peace deal with the Taliban known as the Doha Agreement. The Doha Agreement committed to the withdrawal of US and allied troops from Afghanistan by May 1, 2021, if the Taliban negotiated a peace agreement with the Afghan government. The deal also required that the Taliban take steps to prevent groups including al-Qaeda from threatening national security.",
    body_es: "Spanish body"
  },
  {
    id: "Taliban_3",
    body_en: "While the Trump administration argues that the Doha Agreement led to “unusual stability” in Afghanistan, others disagree. Although no American troops had been killed following the US deal with the Taliban, large numbers of Afghan troops and civilians continued to be killed or injured. The Department of Defense reported an uncharacteristic rise in civilian casualties from October 2020- December 2020.",
    body_es: "Spanish body"
  },
  {
    id: "Taliban_4",
    body_en: "On January 20, 2021, President Joe Biden was inaugurated after a tumultuous election and chaotic transfer of power. The newly-elected President did not reverse the Doha Agreement, but he did push back the date of the pull-out of troops to September in the hopes of a more stable transition of power. In May 2021, the Taliban began rapidly capturing districts of Afghanistan, and their control continued to spread between May and August as American and allied troops began withdrawing from the country.",
    body_es: "Spanish body"
  },
  {
    id: "Legacy_1",
    header_en: `America's Uncertain Legacy`,
    header_es: "Spanish header",
    body_en: "On August 15, 2021, nearly twenty years after the attacks on the World Trade Center and Pentagon, the Taliban retook Kabul after President Ashraf Ghani fled the country. More than 300,000 Afghan civilians currently risk Taliban retaliation because they worked for the US government, and as of August 17, 2021, there are nearly 11,000 American citizens stranded in Afghanistan. With the death toll mounting, evacuation efforts remain a matter of life and death for Afghan civilians and Americans currently residing in Afghanistan.",
    body_es: "Spanish body"
  },
  {
    id: "Legacy_2",
    body_en: "The blame game over who lost Afghanistan has only just begun. The future of Afghanistan and the legacy of American military involvement in the Middle East remains uncertain.",
    body_es: "Spanish body"
  },
]
