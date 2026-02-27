/**
 * 数据存储模块
 * 负责棋局保存、加载、棋谱记录等功能
 * 兼容浏览器 localStorage 和 Cordova Storage
 */

const Storage = (function() {
    'use strict';

    const CUN_CHU_JIAN_MING = {
        QI_JU: 'chinese_chess_game_state',
        QI_PU: 'chinese_chess_history',
        SHE_ZHI: 'chinese_chess_settings'
    };

    const ZUI_DA_QI_PU_SHU = 10;

    let shiYongCordova = false;

    /**
     * 初始化存储模块
     */
    function chuShiHua() {
        if (typeof cordova !== 'undefined' && window.sqlitePlugin) {
            shiYongCordova = true;
        }
        
        if (!jianCeCunChuKeYong()) {
            console.warn('本地存储不可用，棋局保存功能将受限');
            return false;
        }
        
        return true;
    }

    /**
     * 检测存储是否可用
     */
    function jianCeCunChuKeYong() {
        try {
            const ceShiJian = '__storage_test__';
            localStorage.setItem(ceShiJian, ceShiJian);
            localStorage.removeItem(ceShiJian);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * 保存数据到本地存储
     */
    function baoCunShuJu(jianMing, shuJu) {
        try {
            const jsonZiFuChuan = JSON.stringify(shuJu);
            
            if (shiYongCordova && window.sqlitePlugin) {
                return new Promise((jieJue, juJue) => {
                    window.sqlitePlugin.openDatabase(
                        { name: 'chinese_chess.db', location: 'default' },
                        (db) => {
                            db.transaction((tx) => {
                                tx.executeSql(
                                    'CREATE TABLE IF NOT EXISTS storage (key TEXT PRIMARY KEY, value TEXT)'
                                );
                                tx.executeSql(
                                    'INSERT OR REPLACE INTO storage (key, value) VALUES (?, ?)',
                                    [jianMing, jsonZiFuChuan],
                                    () => jieJue(true),
                                    (err) => juJue(err)
                                );
                            });
                        },
                        (err) => juJue(err)
                    );
                });
            } else {
                localStorage.setItem(jianMing, jsonZiFuChuan);
                return Promise.resolve(true);
            }
        } catch (e) {
            console.error('保存数据失败:', e);
            return Promise.reject(e);
        }
    }

    /**
     * 从本地存储读取数据
     */
    function duQuShuJu(jianMing) {
        try {
            if (shiYongCordova && window.sqlitePlugin) {
                return new Promise((jieJue, juJue) => {
                    window.sqlitePlugin.openDatabase(
                        { name: 'chinese_chess.db', location: 'default' },
                        (db) => {
                            db.transaction((tx) => {
                                tx.executeSql(
                                    'SELECT value FROM storage WHERE key = ?',
                                    [jianMing],
                                    (tx, results) => {
                                        if (results.rows.length > 0) {
                                            jieJue(JSON.parse(results.rows.item(0).value));
                                        } else {
                                            jieJue(null);
                                        }
                                    },
                                    (err) => juJue(err)
                                );
                            });
                        },
                        (err) => juJue(err)
                    );
                });
            } else {
                const jsonZiFuChuan = localStorage.getItem(jianMing);
                if (jsonZiFuChuan) {
                    return Promise.resolve(JSON.parse(jsonZiFuChuan));
                }
                return Promise.resolve(null);
            }
        } catch (e) {
            console.error('读取数据失败:', e);
            return Promise.reject(e);
        }
    }

    /**
     * 删除本地存储数据
     */
    function shanChuShuJu(jianMing) {
        try {
            if (shiYongCordova && window.sqlitePlugin) {
                return new Promise((jieJue, juJue) => {
                    window.sqlitePlugin.openDatabase(
                        { name: 'chinese_chess.db', location: 'default' },
                        (db) => {
                            db.transaction((tx) => {
                                tx.executeSql(
                                    'DELETE FROM storage WHERE key = ?',
                                    [jianMing],
                                    () => jieJue(true),
                                    (err) => juJue(err)
                                );
                            });
                        },
                        (err) => juJue(err)
                    );
                });
            } else {
                localStorage.removeItem(jianMing);
                return Promise.resolve(true);
            }
        } catch (e) {
            console.error('删除数据失败:', e);
            return Promise.reject(e);
        }
    }

    /**
     * 保存棋局状态
     */
    function baoCunQiJu(zhuangTai) {
        const qiJuShuJu = {
            qiPan: zhuangTai.qiPan,
            dangQianFang: zhuangTai.dangQianFang,
            buShu: zhuangTai.buShu,
            baoCunShiJian: new Date().toISOString()
        };
        return baoCunShuJu(CUN_CHU_JIAN_MING.QI_JU, qiJuShuJu);
    }

    /**
     * 加载棋局状态
     */
    function jiaZaiQiJu() {
        return duQuShuJu(CUN_CHU_JIAN_MING.QI_JU);
    }

    /**
     * 保存棋谱记录
     */
    function baoCunQiPu(buZhouLieBiao) {
        const qiPuShuJu = {
            buZhou: buZhouLieBiao.slice(-ZUI_DA_QI_PU_SHU),
            baoCunShiJian: new Date().toISOString()
        };
        return baoCunShuJu(CUN_CHU_JIAN_MING.QI_PU, qiPuShuJu);
    }

    /**
     * 加载棋谱记录
     */
    function jiaZaiQiPu() {
        return duQuShuJu(CUN_CHU_JIAN_MING.QI_PU);
    }

    /**
     * 保存游戏设置
     */
    function baoCunSheZhi(sheZhi) {
        return baoCunShuJu(CUN_CHU_JIAN_MING.SHE_ZHI, sheZhi);
    }

    /**
     * 加载游戏设置
     */
    function jiaZaiSheZhi() {
        return duQuShuJu(CUN_CHU_JIAN_MING.SHE_ZHI);
    }

    /**
     * 清除所有保存的数据
     */
    function qingChuSuoYouShuJu() {
        const qingChuCaoZuo = [
            shanChuShuJu(CUN_CHU_JIAN_MING.QI_JU),
            shanChuShuJu(CUN_CHU_JIAN_MING.QI_PU),
            shanChuShuJu(CUN_CHU_JIAN_MING.SHE_ZHI)
        ];
        return Promise.all(qingChuCaoZuo);
    }

    /**
     * 棋谱步骤格式化
     */
    function geShiHuaBuZhou(buZhou) {
        const { qiHang, qiLie, muBiaoHang, muBiaoLie, qiZi, beiChiQiZi } = buZhou;
        const mingCheng = ChessRules.huoQuQiZiMingCheng(qiZi);
        const fangXiang = huoQuYiDongFangXiang(qiHang, muBiaoHang, qiLie, muBiaoLie);
        
        let miaoShu = `${mingCheng}`;
        
        if (qiZi.fang === ChessRules.HONG_FANG) {
            miaoShu += `(${9 - qiHang},${qiLie + 1})`;
        } else {
            miaoShu += `(${qiHang + 1},${9 - qiLie})`;
        }
        
        miaoShu += fangXiang;
        
        if (beiChiQiZi) {
            const beiChiMingCheng = ChessRules.huoQuQiZiMingCheng(beiChiQiZi);
            miaoShu += `吃${beiChiMingCheng}`;
        }
        
        return miaoShu;
    }

    /**
     * 获取移动方向描述
     */
    function huoQuYiDongFangXiang(qiHang, muBiaoHang, qiLie, muBiaoLie) {
        const hangCha = muBiaoHang - qiHang;
        const lieCha = muBiaoLie - qiLie;
        
        if (hangCha === 0) {
            return lieCha > 0 ? '右' : '左';
        } else if (lieCha === 0) {
            return hangCha > 0 ? '下' : '上';
        } else {
            if (hangCha > 0) {
                return lieCha > 0 ? '右下' : '左下';
            } else {
                return lieCha > 0 ? '右上' : '左上';
            }
        }
    }

    return {
        chuShiHua,
        baoCunQiJu,
        jiaZaiQiJu,
        baoCunQiPu,
        jiaZaiQiPu,
        baoCunSheZhi,
        jiaZaiSheZhi,
        qingChuSuoYouShuJu,
        geShiHuaBuZhou
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Storage;
}
