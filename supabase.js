const SUPABASE_URL = "https://ycubidshrzofbhcrryhx.supabase.co";

const SUPABASE_PUBLISHABLE_KEY = "GANTI_DENGAN_PUBLISHABLE_KEY_ANDA";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);


// ==========================================
// AUTO LOGOUT SETELAH 30 MENIT TIDAK AKTIF
// ==========================================

const AUTO_LOGOUT_TIME = 30 * 60 * 1000; // 30 menit

let autoLogoutTimer = null;
let userLoggedIn = false;


// Reset timer aktivitas
function resetAutoLogoutTimer() {

    if (!userLoggedIn) return;

    clearTimeout(autoLogoutTimer);

    autoLogoutTimer = setTimeout(async () => {

        alert("Sesi Anda berakhir karena tidak ada aktivitas selama 30 menit.");

        await supabaseClient.auth.signOut();

        window.location.href = "login.html";

    }, AUTO_LOGOUT_TIME);
}


// Aktivitas pengguna
const activityEvents = [
    "click",
    "mousemove",
    "keydown",
    "scroll",
    "touchstart"
];

activityEvents.forEach(event => {

    document.addEventListener(event, resetAutoLogoutTimer, {
        passive: true
    });

});


// Cek apakah user sedang login
async function startAutoLogout() {

    const { data: { session } } =
        await supabaseClient.auth.getSession();

    if (!session) {
        userLoggedIn = false;
        return;
    }

    userLoggedIn = true;

    resetAutoLogoutTimer();
}


startAutoLogout();
