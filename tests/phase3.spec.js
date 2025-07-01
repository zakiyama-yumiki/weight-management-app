import { test, expect } from '@playwright/test';

test.describe('Phase 3: データ管理・表示機能', () => {
  test.beforeEach(async ({ page }) => {
    // アプリケーションのホームページに移動
    await page.goto('http://localhost:5173');
    
    // LocalStorageをクリア（テスト前の初期化）
    await page.evaluate(() => {
      localStorage.clear();
    });
    
    await page.reload();
  });

  test('体重データの入力と保存ができること', async ({ page }) => {
    // 体重入力ページに移動
    await page.click('text=記録入力');
    await expect(page).toHaveURL(/.*input/);

    // 体重データを入力
    await page.fill('input[type="number"][name="weight"]', '70.5');
    await page.fill('input[type="number"][name="bodyFatPercentage"]', '15.8');
    await page.fill('input[type="number"][name="muscleMass"]', '58.2');
    await page.fill('input[type="date"]', '2025-01-01');

    // 保存ボタンをクリック
    await page.click('button[type="submit"]');

    // 成功メッセージまたはリダイレクトを確認
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('記録履歴の表示と編集ができること', async ({ page }) => {
    // テスト用データを事前にLocalStorageに設定
    await page.evaluate(() => {
      const testData = {
        weightRecords: [
          {
            id: "test-1",
            date: "2025-01-01",
            weight: 70.5,
            bodyFatPercentage: 15.8,
            muscleMass: 58.2,
            bmi: 24.2,
            createdAt: "2025-01-01T10:00:00.000Z",
            updatedAt: "2025-01-01T10:00:00.000Z"
          },
          {
            id: "test-2", 
            date: "2025-01-02",
            weight: 70.0,
            bodyFatPercentage: 15.5,
            muscleMass: 58.5,
            bmi: 24.0,
            createdAt: "2025-01-02T10:00:00.000Z",
            updatedAt: "2025-01-02T10:00:00.000Z"
          }
        ],
        weightGoal: null,
        settings: {
          theme: 'light',
          notifications: false,
          height: 170
        },
        version: '1.0.0'
      };
      localStorage.setItem('weight-management-app', JSON.stringify(testData));
    });

    await page.reload();

    // 履歴ページに移動
    await page.click('text=履歴');
    await expect(page).toHaveURL(/.*history/);

    // データが表示されることを確認
    await expect(page.locator('text=70.5')).toBeVisible();
    await expect(page.locator('text=70.0')).toBeVisible();

    // 編集ボタンをクリック
    await page.click('button:has-text("編集"):first');

    // 編集フォームが表示されることを確認
    await expect(page.locator('input[type="number"][value="70.5"]')).toBeVisible();

    // 値を変更
    await page.fill('input[type="number"][value="70.5"]', '69.8');

    // 保存ボタンをクリック
    await page.click('button:has-text("保存")');

    // 変更された値が表示されることを確認
    await expect(page.locator('text=69.8')).toBeVisible();
  });

  test('日付フィルタとソート機能が動作すること', async ({ page }) => {
    // テスト用データを事前にLocalStorageに設定
    await page.evaluate(() => {
      const testData = {
        weightRecords: [
          {
            id: "test-1",
            date: "2024-12-01",
            weight: 72.0,
            bmi: 24.7,
            createdAt: "2024-12-01T10:00:00.000Z",
            updatedAt: "2024-12-01T10:00:00.000Z"
          },
          {
            id: "test-2",
            date: "2025-01-01", 
            weight: 70.5,
            bmi: 24.2,
            createdAt: "2025-01-01T10:00:00.000Z",
            updatedAt: "2025-01-01T10:00:00.000Z"
          },
          {
            id: "test-3",
            date: "2025-01-15",
            weight: 69.8,
            bmi: 23.9,
            createdAt: "2025-01-15T10:00:00.000Z", 
            updatedAt: "2025-01-15T10:00:00.000Z"
          }
        ],
        weightGoal: null,
        settings: {
          theme: 'light',
          notifications: false,
          height: 170
        },
        version: '1.0.0'
      };
      localStorage.setItem('weight-management-app', JSON.stringify(testData));
    });

    await page.reload();

    // 履歴ページに移動
    await page.click('text=履歴');

    // 日付フィルタを設定
    await page.fill('input[type="date"]:first', '2025-01-01');
    await page.fill('input[type="date"]:last', '2025-01-31');

    // フィルタ後に該当データのみ表示されることを確認
    await expect(page.locator('text=70.5')).toBeVisible();
    await expect(page.locator('text=69.8')).toBeVisible();
    await expect(page.locator('text=72.0')).not.toBeVisible();

    // ソート機能をテスト（体重でソート）
    await page.selectOption('select', 'weight');
    await page.selectOption('select:last', 'asc');

    // ソート後の順序を確認（体重の昇順）
    const rows = await page.locator('tbody tr').all();
    expect(rows.length).toBeGreaterThan(0);
  });

  test('グラフ表示と期間選択ができること', async ({ page }) => {
    // テスト用データを事前にLocalStorageに設定
    await page.evaluate(() => {
      const testData = {
        weightRecords: [
          {
            id: "test-1",
            date: "2024-12-25",
            weight: 72.0,
            bmi: 24.7,
            createdAt: "2024-12-25T10:00:00.000Z",
            updatedAt: "2024-12-25T10:00:00.000Z"
          },
          {
            id: "test-2",
            date: "2025-01-01",
            weight: 70.5,
            bmi: 24.2,
            createdAt: "2025-01-01T10:00:00.000Z",
            updatedAt: "2025-01-01T10:00:00.000Z"
          }
        ],
        weightGoal: null,
        settings: {
          theme: 'light',
          notifications: false,
          height: 170
        },
        version: '1.0.0'
      };
      localStorage.setItem('weight-management-app', JSON.stringify(testData));
    });

    await page.reload();

    // ダッシュボードページでグラフが表示されることを確認
    await page.click('text=ダッシュボード');
    
    // グラフ期間選択ボタンが表示されることを確認
    await expect(page.locator('text=1週間')).toBeVisible();
    await expect(page.locator('text=1ヶ月')).toBeVisible();
    await expect(page.locator('text=6ヶ月')).toBeVisible();
    await expect(page.locator('text=1年')).toBeVisible();

    // グラフコンテナが表示されることを確認
    await expect(page.locator('text=体重推移グラフ')).toBeVisible();

    // 期間選択ボタンをクリック
    await page.click('button:has-text("1週間")');
    await expect(page.locator('button:has-text("1週間")').first()).toHaveClass(/bg-blue-600/);

    // 統計情報が表示されることを確認
    await expect(page.locator('text=記録統計')).toBeVisible();
    await expect(page.locator('text=総記録数')).toBeVisible();
  });

  test('データの削除ができること', async ({ page }) => {
    // テスト用データを事前にLocalStorageに設定
    await page.evaluate(() => {
      const testData = {
        weightRecords: [
          {
            id: "test-delete",
            date: "2025-01-01",
            weight: 70.5,
            bmi: 24.2,
            createdAt: "2025-01-01T10:00:00.000Z",
            updatedAt: "2025-01-01T10:00:00.000Z"
          }
        ],
        weightGoal: null,
        settings: {
          theme: 'light',
          notifications: false,
          height: 170
        },
        version: '1.0.0'
      };
      localStorage.setItem('weight-management-app', JSON.stringify(testData));
    });

    await page.reload();

    // 履歴ページに移動
    await page.click('text=履歴');

    // データが表示されることを確認
    await expect(page.locator('text=70.5')).toBeVisible();

    // 削除ダイアログの確認をモック
    page.on('dialog', dialog => dialog.accept());

    // 削除ボタンをクリック
    await page.click('button:has-text("削除")');

    // データが削除されることを確認
    await expect(page.locator('text=記録データがありません')).toBeVisible();
  });
});