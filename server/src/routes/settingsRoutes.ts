import { Router } from 'express';
import { siteSettingsService } from '../services/siteSettingsService';
import { authService } from '../services/authService';

const router = Router();

// Middleware: Verify administrator privileges
const requireAdmin = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  let user;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    user = authService.getUserByToken(token);
  }

  if (!user) {
    const userId = req.headers['x-user-id'] as string;
    if (userId) {
      user = authService.getUser(userId);
    }
  }

  const isAdmin = user && (user.role === 'admin' || user.email === 'admin@tubistream.com');
  if (!isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Administrator privileges required to manage platform settings.'
    });
  }

  req.user = user;
  next();
};

/**
 * GET /api/settings/public
 * Public endpoint to fetch site branding, name, and meta information
 */
router.get('/public', (_req, res) => {
  const settings = siteSettingsService.getSettings();
  res.json({
    success: true,
    settings
  });
});

/**
 * PUT /api/admin/settings
 * Admin endpoint to update platform branding and site name
 */
router.put('/', requireAdmin, (req, res) => {
  try {
    const updated = siteSettingsService.updateSettings(req.body);
    res.json({
      success: true,
      message: `Platform name and branding updated to "${updated.siteName}"`,
      settings: updated
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message || 'Failed to update site settings'
    });
  }
});

/**
 * POST /api/admin/settings/reset
 * Reset platform branding to original factory defaults
 */
router.post('/reset', requireAdmin, (_req, res) => {
  const settings = siteSettingsService.resetToDefaults();
  res.json({
    success: true,
    message: 'Platform settings reset to default',
    settings
  });
});

export default router;
