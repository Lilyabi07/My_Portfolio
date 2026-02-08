using System.Text.RegularExpressions;

namespace MyPortfolio.Services
{
    /// <summary>
    /// Service for detecting and filtering profane language in user submissions.
    /// </summary>
    public interface IProfanityFilterService
    {
        /// <summary>
        /// Checks if text contains any profane words.
        /// </summary>
        /// <param name="text">The text to check</param>
        /// <returns>True if profanity is detected, false otherwise</returns>
        bool ContainsProfanity(string text);

        /// <summary>
        /// Gets a list of profane words found in the text.
        /// </summary>
        /// <param name="text">The text to check</param>
        /// <returns>List of unique profane words found</returns>
        List<string> GetProfaneWordsFound(string text);

        /// <summary>
        /// Validates text and returns detailed profanity check result.
        /// </summary>
        /// <param name="text">The text to check</param>
        /// <returns>Object containing hasProfanity flag and words list</returns>
        ProfanityCheckResult CheckProfanity(string text);
    }

    /// <summary>
    /// Result object from profanity check.
    /// </summary>
    public class ProfanityCheckResult
    {
        public bool HasProfanity { get; set; }
        public List<string> Words { get; set; } = new();
    }

    /// <summary>
    /// Implementation of profanity filter service using regex pattern matching.
    /// </summary>
    public class ProfanityFilterService : IProfanityFilterService
    {
        /// <summary>
        /// List of prohibited words/phrases that should not be allowed in submissions.
        /// </summary>
        private static readonly string[] BadWords = new[]
        {
            "hate", "abuse", "racist", "sexist", "vulgar", "offensive", "slur", "profanity",
            "damn", "hell", "crap", "ass", "bastard", "bitch", "fuck", "shit", "piss",
            "whore", "slut", "nigger", "faggot", "retard", "idiot", "stupid", "dumb"
        };

        /// <summary>
        /// Regex pattern for matching profane words (case-insensitive, whole word boundaries).
        /// </summary>
        private static readonly Regex ProfanityRegex = new(
            @"\b(" + string.Join("|", BadWords.Select(Regex.Escape)) + @")\b",
            RegexOptions.IgnoreCase | RegexOptions.Compiled
        );

        /// <summary>
        /// Checks if text contains any profane words.
        /// </summary>
        public bool ContainsProfanity(string text)
        {
            if (string.IsNullOrWhiteSpace(text))
                return false;

            return ProfanityRegex.IsMatch(text);
        }

        /// <summary>
        /// Gets a list of profane words found in the text.
        /// </summary>
        public List<string> GetProfaneWordsFound(string text)
        {
            if (string.IsNullOrWhiteSpace(text))
                return new List<string>();

            var matches = ProfanityRegex.Matches(text);
            return matches
                .Cast<Match>()
                .Select(m => m.Value.ToLower())
                .Distinct()
                .ToList();
        }

        /// <summary>
        /// Validates text and returns detailed profanity check result.
        /// </summary>
        public ProfanityCheckResult CheckProfanity(string text)
        {
            var words = GetProfaneWordsFound(text);
            return new ProfanityCheckResult
            {
                HasProfanity = words.Count > 0,
                Words = words
            };
        }
    }
}
