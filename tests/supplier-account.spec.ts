import { test, expect } from '@playwright/test';

test.describe('Supplier and Account Features', () => {
  test.beforeEach(async ({ page }) => {
    // Start from the home page for each test
    await page.goto('http://localhost:5000');
  });

  test('should display supplier listings', async ({ page }) => {
    // Navigate to suppliers page
    await page.getByRole('link', { name: /suppliers/i }).click();
    
    // Verify supplier list is visible
    const supplierList = page.getByRole('list', { name: /supplier list/i });
    await expect(supplierList).toBeVisible();
    
    // Take a screenshot for visual feedback
    await page.screenshot({ path: 'supplier-list.png' });
    
    // Verify supplier cards have required information
    const supplierCards = page.getByRole('article');
    await expect(supplierCards).toHaveCount(3); // Adjust based on your mock data
    
    // Check if each card has price and rating
    for (const card of await supplierCards.all()) {
      await expect(card.getByRole('heading')).toBeVisible();
      await expect(card.getByText(/\£/)).toBeVisible(); // Price
      await expect(card.getByRole('img', { name: /rating/i })).toBeVisible();
    }
  });

  test('should allow account creation', async ({ page }) => {
    // Click sign up button
    await page.getByRole('button', { name: /sign up/i }).click();
    
    // Fill in the registration form
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('Test123!');
    await page.getByLabel(/confirm password/i).fill('Test123!');
    
    // Take a screenshot before submission
    await page.screenshot({ path: 'before-signup.png' });
    
    // Submit the form
    await page.getByRole('button', { name: /create account/i }).click();
    
    // Verify successful registration
    await expect(page.getByText(/welcome/i)).toBeVisible();
    
    // Take a screenshot after successful registration
    await page.screenshot({ path: 'after-signup.png' });
  });

  test('should show supplier details on click', async ({ page }) => {
    // Navigate to suppliers page
    await page.getByRole('link', { name: /suppliers/i }).click();
    
    // Click on first supplier
    const firstSupplier = page.getByRole('article').first();
    await firstSupplier.click();
    
    // Verify detailed view
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByText(/contact information/i)).toBeVisible();
    await expect(page.getByText(/service area/i)).toBeVisible();
    
    // Take a screenshot of the detailed view
    await page.screenshot({ path: 'supplier-details.png' });
  });
}); 