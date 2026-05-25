import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const SETTINGS_FILE = join(process.cwd(), 'data', 'settings.json');

// Default settings
const DEFAULT_SETTINGS = {
  enableStripePayment: true,
  enableShopifyPayment: true,
  enableLocalPickup: false,
  enablePhoneOrders: false,
  localPickupLocation: '123 Main St, Your City, CA 90000',
  localPickupHours: 'Monday-Friday 9AM-6PM, Saturday 10AM-4PM',
  autoConfirmLocalPickup: false,
};

async function loadSettings() {
  try {
    const data = await readFile(SETTINGS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return DEFAULT_SETTINGS;
  }
}

async function saveSettings(settings) {
  try {
    await writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
}

export async function GET(request) {
  try {
    const settings = await loadSettings();
    return Response.json(settings);
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const settings = await request.json();
    const success = await saveSettings(settings);

    if (success) {
      return Response.json(settings);
    } else {
      return Response.json(
        { error: 'Failed to save settings' },
        { status: 500 }
      );
    }
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
