import { test, expect } from '@playwright/test';

test('should render the page with menu and curated shows', async ({ page }) => {
    await page.goto('/');
    expect(page.getByTestId('menu')).toBeTruthy();
    expect(page.getByTestId('curated-shows')).toBeTruthy();
})

test('should render the chart page when show chart is clicked', async ({ page }) => {
    await page.goto('/');
    expect(page.getByTestId('menu')).toBeTruthy();
    expect(page.getByTestId('curated-shows')).toBeTruthy();

    await page.getByTestId('show-chart').click();
    await expect(page).toHaveURL('/shows-chart')
    await expect(page.locator('h2')).toContainText('Chart displays the total content hours available by Category')
})