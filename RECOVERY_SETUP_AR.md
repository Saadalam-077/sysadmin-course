# استعادة كلمة المرور — إدارة الأنظمة

## ما الذي تغير؟
- رابط «نسيت كلمة المرور؟» في صفحة الدخول.
- الاستعادة: الرقم الجامعي + رمز الاستعادة **`1234567890`** + كلمة مرور جديدة (8 أحرف على الأقل).
- كلمات المرور تُخزَّن مُجزّأة (bcrypt)، والدخول والتسجيل عبر دوال قاعدة البيانات:
  `sysadmin_student_login` و`sysadmin_register_student` و`sysadmin_reset_student_password`.
- لا تُحذف حسابات الطلاب ولا تقدمهم، وكلمات المرور الحالية تبقى تعمل.

## خطوات التفعيل
**تلقائيًا:** سير العمل `.github/workflows/supabase.yml` (Deploy Supabase) يطبّق ملفات
`supabase/migrations/*.sql` على قاعدة البيانات عند كل دمج في `main` يغيّر مجلد `supabase/`،
أو يدويًا من **Actions → Deploy Supabase → Run workflow**.
يحتاج مرة واحدة السر `SUPABASE_ACCESS_TOKEN` في:
GitHub → **Settings → Secrets and variables → Actions → New repository secret**
(نفس التوكن المستخدم في مستودعي com_prog وdata_struc، من supabase.com → Account preferences → Access Tokens).

**يدويًا (بديل):** Supabase → **SQL Editor** → انسخ محتوى
`supabase/migrations/20261112000000_password_hashing.sql` ونفّذه.

بعدها اختبر: دخول بكلمة مرور طالب حالية، ثم استعادة بالرمز `1234567890`، ثم تسجيل طالب جديد.

## تنبيه أمني
الرمز موحّد لجميع الطلاب ويمكن إعادة استخدامه؛ من يعرف رقمًا جامعيًا والرمز يستطيع تغيير كلمة مرور ذلك الطالب.
