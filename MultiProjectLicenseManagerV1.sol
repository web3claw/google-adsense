// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

/**
 * @title MultiProjectLicenseManagerV1 (可升级代理模式 - 多项目多用户区块链授权合约)
 * @notice 支持 OpenZeppelin UUPS 代理升级，支持多项目多用户在线授权与 BNB 链 Block Timestamp 真实时间校验
 */
contract MultiProjectLicenseManagerV1 is Initializable, OwnableUpgradeable, UUPSUpgradeable {
    struct LicenseInfo {
        uint256 expireTimestampMs; // 毫秒级到期时间戳
        bool isActive;             // 账号激活状态 (true: 正常, false: 停用)
        uint256 lastUpdated;       // 最后更新区块时间
    }

    // 存储映射：projectId => userId => LicenseInfo
    mapping(string => mapping(string => LicenseInfo)) private _licenses;

    event LicenseSet(string indexed projectId, string indexed userId, uint256 expireTimestampMs, bool isActive);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @notice UUPS 代理初始化函数 (替代传统 constructor)
     */
    function initialize(address initialOwner) initializer public {
        __Ownable_init(initialOwner);
    }

    /**
     * @notice 授权升级检查 (仅合约 Owner 有权升级代码逻辑)
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    /**
     * @notice 设置/更新指定项目下指定用户的授权与到期时间
     */
    function setLicense(
        string memory projectId,
        string memory userId,
        uint256 expireTimestampMs,
        bool isActive
    ) public onlyOwner {
        _licenses[projectId][userId] = LicenseInfo({
            expireTimestampMs: expireTimestampMs,
            isActive: isActive,
            lastUpdated: block.timestamp
        });

        emit LicenseSet(projectId, userId, expireTimestampMs, isActive);
    }

    /**
     * @notice 批量设置多个用户的时间戳 (节省 Gas 费)
     */
    function batchSetLicenses(
        string[] memory projectIds,
        string[] memory userIds,
        uint256[] memory expireTimestampMsArray,
        bool[] memory isActiveArray
    ) external onlyOwner {
        require(
            projectIds.length == userIds.length &&
            userIds.length == expireTimestampMsArray.length &&
            expireTimestampMsArray.length == isActiveArray.length,
            "Array lengths must match"
        );

        for (uint256 i = 0; i < projectIds.length; i++) {
            setLicense(projectIds[i], userIds[i], expireTimestampMsArray[i], isActiveArray[i]);
        }
    }

    /**
     * @notice 查询授权信息 (包含 BNB 链共识出的真实世界区块时间戳 blockTimestampMs)
     * @return expireTimestampMs 许可到期时间戳 (毫秒)
     * @return isActive 账号激活状态
     * @return isExpired 是否已超期
     * @return blockTimestampMs BNB 链当前区块权威真实时间戳 (毫秒) -> 100% 免疫客户端篡改系统时间！
     */
    function getLicense(
        string memory projectId,
        string memory userId
    ) external view returns (
        uint256 expireTimestampMs,
        bool isActive,
        bool isExpired,
        uint256 blockTimestampMs
    ) {
        LicenseInfo memory lic = _licenses[projectId][userId];
        uint256 currentBlockMs = block.timestamp * 1000;
        bool expired = (lic.expireTimestampMs > 0 && currentBlockMs >= lic.expireTimestampMs);
        return (lic.expireTimestampMs, lic.isActive, expired, currentBlockMs);
    }
}
