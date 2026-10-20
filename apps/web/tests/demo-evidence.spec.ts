import {expect,test} from '@playwright/test';

test('evidence demo exposes manual, autoplay, clean and full-story entry points',async({page})=>{
  await page.goto('/demo');
  await expect(page.getByRole('button',{name:/Start product proof/})).toBeVisible();
  await expect(page.getByRole('link',{name:/complete system story/i})).toHaveAttribute('href','/demo?mode=full');
  await expect(page.locator('iframe[title="JeevanRekha interactive prototype"]')).toHaveCount(1);
  await page.goto('/demo?mode=full');
  await expect(page.locator('body')).toContainText(/JeevanRekha/i);
});

test('core consent survives role switching and revoke blocks retrieval',async({page})=>{
  await page.goto('/prototype?demo=1');
  await page.getByRole('button',{name:/Doctor/}).first().click();
  await page.getByRole('button',{name:'Confirm correct patient'}).click();
  await page.getByRole('button',{name:/Prescriptions/}).click();
  await page.getByRole('button',{name:'2 hours'}).click();
  await page.getByRole('button',{name:'Send consent request'}).click();
  await page.getByRole('button',{name:/Citizen/}).first().click();
  await page.getByRole('button',{name:'Access',exact:true}).click();
  await page.getByRole('button',{name:'Allow Access for 1 hour'}).click();
  await page.getByRole('button',{name:/Doctor/}).first().click();
  await expect(page.getByText('MATCH CONFIRMED')).toBeVisible();
  await expect(page.getByText('CBC — Complete Blood Count')).toBeVisible();
  await page.getByRole('button',{name:/Citizen/}).first().click();
  await page.getByRole('button',{name:'Access',exact:true}).click();
  await page.getByRole('button',{name:'Revoke access'}).click();
  await page.getByRole('button',{name:/Doctor/}).first().click();
  await expect(page.getByText('No active authorization')).toBeVisible();
  await expect(page.getByText('CBC — Complete Blood Count')).toHaveCount(0);
});

test('deny grants no doctor access',async({page})=>{
  await page.goto('/prototype');
  await page.getByRole('button',{name:/Doctor/}).first().click();
  await page.getByRole('button',{name:'Confirm correct patient'}).click();
  await page.getByRole('button',{name:'Send consent request'}).click();
  await page.getByRole('button',{name:/Citizen/}).first().click();
  await page.getByRole('button',{name:'Access',exact:true}).click();
  await page.getByRole('button',{name:/Deny/}).click();
  await page.getByRole('button',{name:/Doctor/}).first().click();
  await expect(page.getByText('No active authorization')).toBeVisible();
  await expect(page.getByText('CBC — Complete Blood Count')).toHaveCount(0);
});

test('network failure keeps only offline minimum and says care continues',async({page})=>{
  await page.goto('/prototype');
  await page.getByRole('button',{name:/Responder/}).first().click();
  await page.getByRole('button',{name:'Simulate network loss'}).click();
  await expect(page.getByText('OFFLINE MODE')).toBeVisible();
  await expect(page.getByText(/Standard emergency care continues/)).toBeVisible();
  await expect(page.getByRole('button',{name:'Open Tier 1'})).toBeDisabled();
});
