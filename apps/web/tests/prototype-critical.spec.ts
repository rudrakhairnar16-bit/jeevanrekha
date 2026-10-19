import {expect,test} from '@playwright/test';

async function openDoctor(page:any){
  await page.goto('/prototype');
  await page.getByRole('button',{name:/Doctor/}).first().click();
  await page.getByRole('button',{name:'Confirm correct patient'}).click();
}

test('labs-only grant omits prescription content and preserves requested duration',async({page})=>{
  await openDoctor(page);
  await page.getByRole('button',{name:/Prescriptions/}).click();
  await page.getByRole('button',{name:'2 hours'}).click();
  await expect(page.getByText('Duration: 1 hour')).toBeVisible();
  await page.getByRole('button',{name:'Send consent request'}).click();
  await page.getByRole('button',{name:/Citizen/}).first().click();
  await page.getByRole('button',{name:'Access',exact:true}).click();
  await expect(page.getByText('Labs',{exact:true})).toBeVisible();
  await expect(page.getByRole('button',{name:'Allow Access for 1 hour'})).toBeVisible();
  await page.getByRole('button',{name:'Allow Access for 1 hour'}).click();
  await page.getByRole('button',{name:/Doctor/}).first().click();
  await expect(page.getByText('CBC — Complete Blood Count')).toBeVisible();
  await expect(page.getByText(/Prescription — non-conflicting/)).toHaveCount(0);
  await expect(page.getByText(/Prescription · synthetic verified fixture/)).toHaveCount(0);
});

test('unauthorized doctor view omits sensitive sealed metadata',async({page})=>{
  await openDoctor(page);
  await page.getByRole('button',{name:'Send consent request'}).click();
  await page.getByRole('button',{name:/Citizen/}).first().click();
  await page.getByRole('button',{name:'Access',exact:true}).click();
  await page.getByRole('button',{name:/Allow Access/}).click();
  await page.getByRole('button',{name:/Doctor/}).first().click();
  const text=await page.locator('body').innerText();
  expect(text).not.toMatch(/MindCare|Psychiatric Clinic|Sealed psychiatric episode/i);
});

test('credential location does not authenticate responder',async({page})=>{
  await page.goto('/prototype');
  await page.getByRole('button',{name:/Responder/}).first().click();
  await page.getByLabel('Credential location').selectOption('on');
  await expect(page.getByText('PATIENT MATCH SIMULATED')).toBeVisible();
  await expect(page.getByRole('button',{name:'Open Tier 1'})).toBeDisabled();
  await page.getByRole('button',{name:'Authenticate responder (simulated)'}).click();
  await expect(page.getByRole('button',{name:'Open Tier 1'})).toBeEnabled();
});

test('guided jury path prioritizes core consent before extensions',async({page})=>{
  await page.goto('/prototype');
  await expect(page.getByRole('button',{name:/Run 90–120 sec jury path/})).toBeVisible();
  await page.getByRole('button',{name:/Run 90–120 sec jury path/}).click();
  await expect(page.getByText(/CORE · Match the patient/)).toBeVisible();
  await page.getByRole('button',{name:'Next →'}).click();
  await expect(page.getByText(/CORE · Review WHO/)).toBeVisible();
  await page.getByRole('button',{name:'Next →'}).click();
  await expect(page.getByText(/CORE · Confirm only the granted scope/)).toBeVisible();
  await page.getByRole('button',{name:'Next →'}).click();
  await expect(page.getByText(/EMERGENCY EXTENSION/)).toBeVisible();
});
